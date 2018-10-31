const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const axios = require('axios')
const CircularJSON = require('circular-json')
const querystring = require("querystring")
// https://www.npmjs.com/package/crypto-js
const CryptoJS = require("crypto-js")

var cryptoKey = "doraemon"
/*
// Encrypt
var ciphertext = CryptoJS.AES.encrypt('Hello~ Doraemon', cryptoKey);
console.log("ciphertext:" + ciphertext);

// Decrypt
var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), cryptoKey);
var plaintext = bytes.toString(CryptoJS.enc.Utf8);
console.log("plaintext:" + plaintext);
*/

// https://nodemailer.com/about/
const nodemailer = require('nodemailer')

// https://momentjs.com/docs/
const moment = require('moment')

var http = require('http'),
	fs = require('fs')

axios.defaults.timeout = 20000;

var port1 = 9081

var app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

http.createServer(app).listen(port1, function () {
	console.log('Http ppRestServer listening on port ' + port1)
})

var mongoose = require('mongoose')
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://pp:pp**@192.168.66.30:27017/pp')
var db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback){
  console.log("Connection Succeeded");
});

var ParkingZoneData = require("../models/parkingZoneData")
var SmsAuth = require("../models/smsAuth")
var User = require("../models/user")
var JoinUser = require("../models/joinuser")
var LeaveUser = require("../models/leaveuser")

// Fetch all data of parkingzonedatas
app.get('/pzData', (req, res) => {
	ParkingZoneData.find({}, '', function (error, result) {
		if (error) { console.error(error); }
	    res.send(result)
	})
})

// Search with keyword
// curl -v -X GET "https://dapi.kakao.com/v2/local/search/keyword.json" --data-urlencode "query=인제사거리" -H "Authorization: KakaoAK 7a74240456f5a686f0d2fc5d67fcf632"
app.get('/searchWithKeyword/:searchText', (req, res) => {
	var apiPath = "https://dapi.kakao.com/v2/local/search/keyword.json"
    console.log('req.params.searchText - ' + req.params.searchText)

    var params = querystring.stringify({query:req.params.searchText})
    console.log('params - ' + params)

	axios.post(apiPath, params, {
		headers: {
			'Content-type': 'application/x-www-form-urlencoded',
			'Authorization': 'KakaoAK 7a74240456f5a686f0d2fc5d67fcf632'
		}
	})
	.then(function (response) {
		res.send(response.data)
	})
	.catch(function (error) {
		console.log(error)
	})
})

// Fetch auth_code with phone_no
app.get('/getAuthCode/:phone_no', (req, res) => {
	SmsAuth.find({}, '', function (error, result) {
		if (error) { console.error(error); }
	    res.send(result)
	}).where('phone_no').equals(req.params.phone_no)
})

function leadingZeros(n, digits) {
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}

function getNowDate() {
	var nowDate = new Date()
	var nowDateValue = ''
	nowDateValue = leadingZeros(nowDate.getFullYear(), 4) + '-' +
			   	   leadingZeros(nowDate.getMonth() + 1, 2) + '-' +
			   	   leadingZeros(nowDate.getDate(), 2) + ' ' +
			   	   leadingZeros(nowDate.getHours(), 2) + ':' +
			   	   leadingZeros(nowDate.getMinutes(), 2) + ':' +
			   	   leadingZeros(nowDate.getSeconds(), 2)
	return nowDateValue
}

// Add new user, joinusers
app.post('/addNewUser', (req, res) => {
  console.log(req.body);
  var name = req.body.name;
  var email = req.body.email;
  var password = CryptoJS.AES.encrypt(req.body.password, cryptoKey)
  var phone_no = req.body.phone_no;
  var car_no = "";
  var car_type = "";
  var level = req.body.level;
  var tmp_pw_date = "";
  var join_date = getNowDate();
  var mod_date = "";
  var pw_date = getNowDate();

  var new_user = new User({
    name: name,
    email: email,
    password: password,
    phone_no: phone_no,
    car_no: car_no,
    car_type: car_type,
    level: level,
    tmp_pw_date: tmp_pw_date,
    join_date: join_date,
    mod_date: mod_date,
    pw_date: pw_date
  })

  var join_user = new JoinUser({
  	email: email,
  	join_date: join_date
  })

  new_user.save(function (error, result) {
    if (error) {
      console.log(error)
    }

    join_user.save(function (error, result) {
    	if (error) {
	      console.log(error)
	    }

	    // 가입 축하메일 보내기
	    sendMail(email, "[주차왕파킹]회원가입을 축하드립니다.", "주차왕파킹 회원이 되신것을 진심으로 환영합니다.")

	    res.send({
	      success: true,
	      message: 'User saved successfully!',
	      result: result
	    })
    })
  })
})

// login with email & password
// https://stackoverflow.com/questions/13397691/how-can-i-send-a-success-status-to-browser-from-nodejs-express
app.get('/login/:email/:password', (req, res) => {
	// console.log(req.params)
	User.find({}, '', function (error, result) {
		if (error) { console.error(error); }

		if (0 == result.length) {
			res.status(201).json([{error: "Invalid email"}]);
		} else {
			// Decrypt
			var bytes  = CryptoJS.AES.decrypt(result[0].password, cryptoKey);			
			var plaintext = bytes.toString(CryptoJS.enc.Utf8);
			if(plaintext == req.params.password) {
				// res.status(200).json([{error: "Password ok"}]);				
				res.send(result)
			} else {				
				res.status(202).json([{error: "Invalid password"}]);				
			}
		}
	})
	.where('email').equals(req.params.email)	
})

// Fetch users level
app.get('/getUserLevel/:email', (req, res) => {
	// console.log(req.params)
	User.find({}, 'level', function (error, result) {
		if (error) { console.error(error); }
		res.send(result)
	})
	.where('email').equals(req.params.email)	
})

// Fetch all data of user
app.get('/getAllUser', (req, res) => {
	User.find({}, '', function (error, result) {
		if (error) { console.error(error); }
	    res.send(result)
	})
})

// Update user
app.put('/updateUser/:id', (req, res) => {
  	// console.log(req.body)
  	User.findById(req.params.id, '', function (error, users) {
    	if (error) { console.error(error); }

	    users.name = req.body.name;
	    users.email = req.body.email;
	    if (req.body.password == "") {
	    } else {
	    	users.password = CryptoJS.AES.encrypt(req.body.password, cryptoKey)	
	    }	    
	    users.phone_no = req.body.phone_no;
	    users.car_no = req.body.car_no;
	  	users.car_type = req.body.car_type;
	  	users.level = req.body.level;
	  	users.mod_date = getNowDate();
	  	
	    users.save(function (error) {
		    if (error) {
		       	console.log(error)
		    }
		    res.send({
		        success: true
		    })
	    })
	})
})

// Delete user
app.delete('/deleteUser/:id', (req, res) => {
	User.remove({
		_id: req.params.id
	}, function(err, lands) {
		if (err) {
			res.send(err)
		}
		res.send({
			success: true
		})
	})
})

// Leave user
app.delete('/leaveUser/:id', (req, res) => {
	// 1. Find user with id
	User.findById(req.params.id, '', function (error, users) {
    	if (error) { console.error(error); }
    	
    	// 2. Insert user to LeaveUser
    	var leave_user = new LeaveUser({
	    	name: users.name,
	    	email: users.email,
	    	phone_no: users.phone_no,
	    	car_no: users.car_no,
	    	car_type: users.car_type,
	    	leave_date: getNowDate()
	    })

	    leave_user.save(function (error, result) {
	    	if (error) {
	    		console.error(error);
	    	}

	    	// 3. Delete user with id
	    	User.remove({
				_id: req.params.id
			}, function(err, lands) {
				if (err) {
					res.send(err)
				}
				res.send({
					success: true
				})
			})
	    })
    })
})

// Fetch email
app.get('/getDuplicatedEmail/:email', (req, res) => {
	JoinUser.find({}, '', function (error, result) {
		if (error) { console.error(error); }
	    res.send(result)
	})
	.where('email').equals(req.params.email)
})

// Fetch users by date, searchType, searchContent
app.get('/users/searchBy4/:startDate/:endDate/:searchType/:searchContent', (req, res) => {
  console.log(req.params)
  var query = User.find({})
  
  if('null' == req.params.startDate) {  	  	
  	console.log('startDate null!')
  } else {
  	query.where('join_date').gte(req.params.startDate + " 00:00:00")
  }
  if('null' == req.params.endDate) {
  	console.log('endDate null!')
  } else {
  	query.where('join_date').lte(req.params.endDate + " 23:59:59")
  }

  if((0 != req.params.searchType) && (0 != req.params.searchContent)) {
  	switch(req.params.searchType) {
  		case 'byName' :
  			query.where('name').regex(req.params.searchContent)
  			break;
  		case 'byEmail' :
  			query.where('email').regex(req.params.searchContent)
  			break;
  		case 'byPhone' :
  			query.where('phone_no').regex(req.params.searchContent)
  			break;
  		case 'byLevel' :
  			query.where('level').regex(req.params.searchContent)
  			break;
  		default :
  			break;
  	}
  }

  query.exec().then(result => {
  	res.send(result)
  })
})

function sendMail(toEmailAddress, emailSubject, emailContent) {
	nodemailer.createTestAccount((err, account) => {
	    // create reusable transporter object using the default SMTP transport
	    /*    
	    let transporter = nodemailer.createTransport({
	        host: 'smtp.ethereal.email',
	        port: 587,
	        secure: false, // true for 465, false for other ports
	        auth: {
	            user: 'ttdyjsuwzhlot33n@ethereal.email', // generated ethereal user
	            pass: 'Hr9pceW2HPd785y6RE' // generated ethereal password
	        }
	    });
	    */
	    // http://proal.tistory.com/76
	    let transporter = nodemailer.createTransport({
	        service: 'naver',
	        auth: {
	            user: 'chaosymphony@naver.com', // generated ethereal user
	            pass: 'wrey6342' // generated ethereal password
	        }
	    });
	    
	    // setup email data with unicode symbols
	    let mailOptions = {
	        from: '"주차왕파킹 👻" <chaosymphony@naver.com>', // sender address
	        // to: 'tinyblonco@hanmail.net, chaosymphony@naver.com, chaosymphony@gmail.com', // list of receivers
	        to: toEmailAddress,
	        // subject: 'Hello ✔', // Subject line
	        subject: emailSubject,
	        // text: 'Hello world?', // plain text body
	        text: emailContent,
	        // html: '<b>Hello world?</b>' // html body
	    };

	    // send mail with defined transport object
	    transporter.sendMail(mailOptions, (error, info) => {
	        if (error) {
	            return console.log(error);
	        }
	        console.log('Message sent: %s', info.messageId);
	        // Preview only available when sending through an Ethereal account
	        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

	        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
	        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
	    });
	});
}

// Find password with email
app.get('/findPassword/:email', (req, res) => {
	User.find({}, '', function (error, result) {
		if (error) { console.error(error); }

		if (0 == result.length) {
			res.status(201).json([{error: "Invalid email"}]);
		} else {
			User.findById(result[0]._id, '', function (error, users) {
		    	if (error) { console.error(error); }
		    	var newPw = getRandomCode()	// 임시비밀번호 생성
			    users.password = CryptoJS.AES.encrypt(newPw, cryptoKey)
			    users.tmp_pw_date = getNowDate()
			    users.save(function (error) {
				    if (error) {
				       	console.log(error)
				    }
				    // 임시비밀번호 이메일로 전송
				    sendMail(req.params.email, "[주차왕파킹]임시비밀번호가 발급되었습니다.", "임시비밀번호 : " + newPw)

				    res.status(200).json([{error: "Password is sent"}]);
			    })
			})
		}
	})
	.where('email').equals(req.params.email)	
})

// Create random password
// http://ilikefox.tistory.com/6
function createCode(objArr, iLength) {
    var arr = objArr;
    var randomStr = "";
    
    for (var j=0; j<iLength; j++) {
        randomStr += arr[Math.floor(Math.random()*arr.length)];
    }
    
    return randomStr
}

// 대문자
function getRandomBigLetter(iLength) {
	var arr="A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(",");
    var rnd = createCode(arr, iLength);
    return rnd;
}

// 소문자
function getRandomSmallLetter(iLength) {
	var arr="a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z".split(",");
    var rnd = createCode(arr, iLength);    
    return rnd;
}

// 특수문자
function getRandomSpecialLetter(iLength) {
	var arr="~,`,!,@,#,$,%,^,&,*,(,),-,+,|,_,=,\,[,],{,},<,>,?,/,.,;".split(",");
    var rnd = createCode(arr, iLength);    
    return rnd;
}

// 숫자
function getRandomNum(iLength) {
	var arr="0,1,2,3,4,5,6,7,8,9".split(",");
    var rnd = createCode(arr, iLength);    
    return rnd;
}

function getRandomCode() {
	return getRandomBigLetter(2) + getRandomSmallLetter(2) + getRandomSpecialLetter(1) + getRandomNum(1)
}

// check login process
app.get('/checkPasswordExpired/:email', (req, res) => {
	User.find({}, '', function (error, result) {
		if (error) { console.error(error); }

		if (0 == result.length) {
			res.status(201).json([{error: "Invalid email"}]);
		} else {
			if ("" == result[0].tmp_pw_date) {				
				var pwExpireDate = moment(result[0].pw_date).add(3, 'months').format("YYYY-MM-DD HH:mm:ss")				
				var nowDate = moment().format("YYYY-MM-DD HH:mm:ss")
				if (nowDate > pwExpireDate) {
					// 비번 수정 창으로 이동
					console.log('pwDate expired!')
					res.status(201).json([{error: "Expired password"}]);
				} else {
					// 로그인
					console.log('pwDate not expired!')
					res.status(200).json([{error: "Login success"}]);
				}
			} else {
				var tmpPwExpireDate = moment(result[0].tmp_pw_date).add(1, 'days').format("YYYY-MM-DD HH:mm:ss")				
				var nowDate = moment().format("YYYY-MM-DD HH:mm:ss")
				if (nowDate > tmpPwExpireDate) {
					// 임시비번 재발급 창으로 이동
					console.log('tmpPwDate expired!')
					res.status(202).json([{error: "Expired temp password"}]);
				} else {
					// 비번 수정 창으로 이동
					console.log('tmpPwDate not expired!')
					res.status(203).json([{error: "Move to update temp password"}]);
				}
			}			
		}
	})
	.where('email').equals(req.params.email)	
})

// Update user password
app.put('/updateUserPassword', (req, res) => {
  	console.log(req.body)
  	User.find({}, '', function (error, users) {
    	if (error) { console.error(error); }

    	// 기존 비밀번호 비교    	
    	var inputNowPw = req.body.nowPassword;
		var bytes  = CryptoJS.AES.decrypt(users[0].password, cryptoKey);
		var plaintext = bytes.toString(CryptoJS.enc.Utf8);
		
		if (plaintext === inputNowPw) {
			console.log("same")
		} else {
			console.log("different")
			res.status(201).json([{error: "No match now password"}]);
			return;
		}

	    if (req.body.password == "") {
	    } else {
	    	users[0].password = CryptoJS.AES.encrypt(req.body.password, cryptoKey)	
	    }
	    users[0].tmp_pw_date = ""
	    users[0].pw_date = getNowDate()
	    	    
	    users[0].save(function (error) {
		    if (error) {
		       	console.log(error)
		    }
		    res.send({
		        success: true
		    })
	    })
	})
	.where('email').equals(req.body.email)
})

/*
// Fetch all data of wcData with aggregate
app.get('/wcData/getAllDataOfAggData/:startDate/:endDate', (req, res) => {
	WcData.aggregate([
		{
			"$unwind" : "$currentData"
		},
        {
            "$group" : {
                "_id" : { "$concat" : [ "$currentData.weather.baseDate", " ", "$currentData.weather.baseTime" ] },
                "baseDate": { "$first": '$currentData.weather.baseDate' },
			  	"baseTime": { "$first": '$currentData.weather.baseTime' },
              	"t1h": { "$first": '$currentData.weather.t1h' },
              	"reh": { "$first": '$currentData.weather.reh' },
              	"rn1": { "$first": '$currentData.weather.rn1' },
              	"pty": { "$first": '$currentData.weather.pty' },
              	"sky": { "$first": '$currentData.weather.sky' }
            }
        },
        {
            "$match" : {
                "_id" : { "$gte" : req.params.startDate, "$lte" : req.params.endDate }
            }
        },
        {
        	"$sort" : { "_id": 1 } 
        }
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.send(result);
        }
    });
})

// Fetch wcData with aggregate
app.get('/wcData/getAggData/:startDate/:endDate', (req, res) => {
	// http://www.fun-coding.org/mongodb_advanced5.html
	// https://stackoverflow.com/questions/18785707/mongodb-aggregate-embedded-document-values
	// https://stackoverflow.com/questions/39158286/mongoose-aggregate-with-unwind-before-group
	WcData.aggregate([
		{
			"$unwind" : "$currentData"
		},
        {
            "$group" : {
                "_id" : { "$substr" : [ "$currentData.insertDate", 0, 10 ] },
                "t1hMin" : { "$min" : "$currentData.weather.t1h" },
	            "t1hMax" : { "$max" : "$currentData.weather.t1h" },
	            "t1hAvg" : { "$avg" : "$currentData.weather.t1h" },
	            "rehMin" : { "$min" : "$currentData.weather.reh" },
	            "rehMax" : { "$max" : "$currentData.weather.reh" },
	            "rehAvg" : { "$avg" : "$currentData.weather.reh" }
            }
        },
        {
            "$match" : {
                "_id" : { "$gte" : req.params.startDate, "$lte" : req.params.endDate }
            }
        },
        {
        	"$sort" : { "_id": 1 } 
        }
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.send(result);
        }
    });
})

// Fetch all data of sensorData with aggregate
app.get('/ssData/getAllDataOfAggData/:startDate/:endDate', (req, res) => {
	SsData.find({}, '', function (error, result) {
		if (error) { console.error(error); }
	    res.send(result)
	})
	.where('date').gte(req.params.startDate + " 00:00:00").lte(req.params.endDate + " 23:59:59")
})


// Fetch sensorData with aggregate
app.get('/ssData/getAggData/:startDate/:endDate', (req, res) => {
	console.log(req.body);
	// http://www.fun-coding.org/mongodb_advanced5.html
	// https://stackoverflow.com/questions/18785707/mongodb-aggregate-embedded-document-values
	// https://stackoverflow.com/questions/39158286/mongoose-aggregate-with-unwind-before-group
	SsData.aggregate([
        {
            "$group" : {
                "_id" : { "$substr" : [ "$date", 0, 8 ] },
                "temMin" : { "$min" : "$temperature" },
	            "temMax" : { "$max" : "$temperature" },
	            "temAvg" : { "$avg" : "$temperature" },
	            "humMin" : { "$min" : "$humidity" },
	            "humMax" : { "$max" : "$humidity" },
	            "humAvg" : { "$avg" : "$humidity" },
	            "co2Min" : { "$min" : "$co2" },
	            "co2Max" : { "$max" : "$co2" },
	            "co2Avg" : { "$avg" : "$co2" }
            }
        },
        {
            "$match" : {
                "_id" : { "$gte" : req.params.startDate, "$lte" : req.params.endDate }
            }
        },
        {
        	"$sort" : { "_id": 1 } 
        }
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.send(result);
        }
    });
})

// Fetch sensorData
app.get('/ssData/lastOne', (req, res) => {
	// https://stackoverflow.com/questions/4421207/mongodb-how-to-get-the-last-n-records
	// db.getCollection("sensordatas").find().skip(db.getCollection("sensordatas").count() - 1)
	SsData.count({}, function( err, count){
	    SsData.find({}, 'index temperature humidity co2 date', function (error, sensorDatas) {
	    	res.send(sensorDatas)
	    })
	    .skip(count - 1)
	})
})

function getTodayDate() {
	var todayDate = new Date()
	var todayDateValue = ''
	todayDateValue = leadingZeros(todayDate.getFullYear(), 4) + 
			   		 leadingZeros(todayDate.getMonth() + 1, 2) +
			   		 leadingZeros(todayDate.getDate(), 2)
	return todayDateValue
}

// Fetch agriculture product price
// https://data.mafra.go.kr
// http://211.237.50.150:7080/openapi/8d8857fa9186167880dafee9a8c55dda0d2711b96cd4ae893983f7d870941d2e/xml/Grid_20141221000000000120_1/1/5?PRDLST_NM=%EB%94%B8%EA%B8%B0
app.get('/getProductPrice/:productName', (req, res) => {
	var searchText = encodeURIComponent(req.params.searchText)
	var version = '3.0.0-fwjournal'
	var domain = 'www.ezinfotech.co.kr'
	var productCode = ''
	axios.get('http://211.237.50.150:7080/openapi/' + serviceKeyForPrice +
		'/json/Grid_20141221000000000120_1/1/5' +
		'?PRDLST_NM=' + encodeURIComponent(req.params.productName))
  	.then(function (response) {
  		// console.log(response.data)
  		if (0 == response.data.Grid_20141221000000000120_1.totalCnt) {
  			// console.log('totalCnt is 0')
  			res.send(false)
  			return
  		}
  		productCode = response.data.Grid_20141221000000000120_1.row[0].PRDLST_CD
  		// http://211.237.50.150:7080/openapi/8d8857fa9186167880dafee9a8c55dda0d2711b96cd4ae893983f7d870941d2e/xml/Grid_20150401000000000216_1/1/5?AUCNG_DE=20180613&PRDLST_CD=0804
  		axios.get('http://211.237.50.150:7080/openapi/' + serviceKeyForPrice +
  			'/json/Grid_20150401000000000216_1/1/5?AUCNG_DE=' + getTodayDate() + 
  			'&PRDLST_CD=' + productCode)
  		.then(function (response) {
  			// console.log(response.data)
  			if (0 == response.data.Grid_20150401000000000216_1.totalCnt) {
	  			// console.log('totalCnt is 0')
	  			res.send(false)
	  			return
	  		}

  			res.send(response.data)
  		}).catch(function (error) {
  			console.log(error)
  		})
  	}).catch(function (error) {
    	console.log(error)
  })
})

// Fetch address
// https://www.poesis.org/postcodify/guide/appdev
// https://api.poesis.kr/post/search.php?q=검색어&v=버전&ref=도메인
app.get('/getAddress/:searchText', (req, res) => {
	var searchText = encodeURIComponent(req.params.searchText)
	var version = '3.0.0-fwjournal'
	var domain = 'www.ezinfotech.co.kr'

	axios.get('https://api.poesis.kr/post/search.php?q=' + searchText +
		'&v=' + version +
		'&ref=' + domain)
  	.then(function (response) {  		
  		res.send(response.data)
  		//res.send(CircularJSON.stringify(response.data))
  }).catch(function (error) {
    console.log(error)
  })
})

function getTodayBaseTime() {
	var todayDate = new Date()
	var currentHour = todayDate.getHours()
	var currentMin = todayDate.getMinutes()
	var baseDate = ''
	var baseTime = ''

	if(40 <= currentMin) {
		if(6 <= currentHour) {
			baseDate = leadingZeros(todayDate.getFullYear(), 4) + 
					   leadingZeros(todayDate.getMonth() + 1, 2) +
					   leadingZeros(todayDate.getDate(), 2)
			baseTime = leadingZeros(currentHour, 2) + '00'
		} else if(6 > currentHour) {
			var yesterdayDate = new Date()
			yesterdayDate.setDate(yesterdayDate.getDate() - 1)
			baseDate = leadingZeros(yesterdayDate.getFullYear(), 4) + 
					   leadingZeros(yesterdayDate.getMonth() + 1, 2) +
					   leadingZeros(yesterdayDate.getDate(), 2)
			baseTime = '2300'
		}
	} else if(40 > currentMin) {
		if(6 <= currentHour) {
			baseDate = leadingZeros(todayDate.getFullYear(), 4) + 
					   leadingZeros(todayDate.getMonth() + 1, 2) +
					   leadingZeros(todayDate.getDate(), 2)
			baseTime = leadingZeros((currentHour-1), 2) + '00'
		} else if(6 > currentHour) {
			var yesterdayDate = new Date()
			yesterdayDate.setDate(yesterdayDate.getDate() - 1)
			baseDate = leadingZeros(yesterdayDate.getFullYear(), 4) + 
					   leadingZeros(yesterdayDate.getMonth() + 1, 2) +
					   leadingZeros(yesterdayDate.getDate(), 2)
			baseTime = '2300'
		}
	}
	// console.log(baseDate + ' ' + baseTime)
	return baseDate + '' + baseTime
}

// Fetch weather data
app.get('/ForecastGrib/:nx/:ny', (req, res) => {
	var baseDateTime = getTodayBaseTime()
	var baseDate = baseDateTime.substring(0, 8)
	var baseTime = baseDateTime.substring(8, 12)

	axios.get('http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastGrib?serviceKey=' + serviceKey +
		'&base_date=' + baseDate +
		'&base_time=' + baseTime +
		'&nx=' + req.params.nx +
		'&ny=' + req.params.ny +
		'&numOfRows=10&pageSize=10&pageNo=1&startPage=1&_type=json')
  	.then(function (response) {  		
  		res.send(response.data.response.body.items)
  		// res.send(CircularJSON.stringify(response.data.response.body))
  }).catch(function (error) {
    console.log(error)
  })
})

// Fetch weather data with date, time, nx, ny
app.get('/ForecastGrib/:baseDate/:baseTime/:nx/:ny', (req, res) => {
	axios.get('http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastGrib?serviceKey=' + serviceKey +
		'&base_date=' + req.params.baseDate +
		'&base_time=' + req.params.baseTime +
		'&nx=' + req.params.nx +
		'&ny=' + req.params.ny +
		'&numOfRows=10&pageSize=10&pageNo=1&startPage=1&_type=json')
  	.then(function (response) {
  		res.send(response.data)
  		// res.send(CircularJSON.stringify(response.data.response.body))
  }).catch(function (error) {
    console.log(error)
  })
})

function leadingZeros(n, digits) {
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}

function getBaseTime(currentHour) {
	var dateRange = [2, 5, 8, 11, 14, 17, 20, 23]
	var todayYYYYMMDD = ''
	var baseHour = 0
	var baseDate = ''
	for(var i = 0; i < dateRange.length; i++) {
		if (currentHour == dateRange[i]) {
			var todayDate = new Date()
			todayYYYYMMDD = leadingZeros(todayDate.getFullYear(), 4) + 
							leadingZeros(todayDate.getMonth() + 1, 2) +
							leadingZeros(todayDate.getDate(), 2)
			baseHour = dateRange[i]
		}
	}

	if (currentHour < 2) {
		var todayDate = new Date()
		todayDate.setDate(todayDate.getDate() - 1)
		todayYYYYMMDD = leadingZeros(todayDate.getFullYear(), 4) + 
						leadingZeros(todayDate.getMonth() + 1, 2) +
						leadingZeros(todayDate.getDate(), 2)
		baseHour = 23
	} else if(currentHour > 23) {
		var todayDate = new Date()
		todayYYYYMMDD = leadingZeros(todayDate.getFullYear(), 4) + 
						leadingZeros(todayDate.getMonth() + 1, 2) +
						leadingZeros(todayDate.getDate(), 2)
		baseHour = 23
	}

	if (0 != baseHour) {
		return todayYYYYMMDD + '' + leadingZeros(baseHour, 2)
	} else {
		var todayDate = new Date()
		todayYYYYMMDD = leadingZeros(todayDate.getFullYear(), 4) + 
						leadingZeros(todayDate.getMonth() + 1, 2) +
						leadingZeros(todayDate.getDate(), 2)

		if (currentHour < 11) {
			if (currentHour < 5) {
				baseHour = 2
			} else if (currentHour > 8) {
				baseHour = 8
			} else if (5 < currentHour && currentHour < 8) {
				baseHour = 5
			}
		} else if (currentHour > 14) {
			if (currentHour < 17) {
				baseHour = 14
			} else if (currentHour > 20) {
				baseHour = 20
			} else if (17 < currentHour && currentHour < 20) {
				baseHour = 17
			}
		} else if (11 < currentHour && currentHour < 14) {
			baseHour = 11
		}
	}
	return todayYYYYMMDD + '' + leadingZeros(baseHour, 2)
}

// Fetch weather (tomorrown, afterTomorrow) data
app.get('/ForecastSpaceData/:nx/:ny', (req, res) => {
	var todayDate = new Date()
	var currentHour = todayDate.getHours()
	var baseDateTime = getBaseTime(currentHour)
	var baseDate = baseDateTime.substring(0, 8)
	var baseTime = baseDateTime.substring(8, 10) + '00'
	
	axios.get('http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastSpaceData?serviceKey=' + serviceKey +
		'&base_date=' + baseDate +
		'&base_time=' + baseTime +
		'&nx=' + req.params.nx +
		'&ny=' + req.params.ny +
		'&numOfRows=500&pageSize=500&pageNo=1&startPage=1&_type=json')
  	.then(function (response) {  		
  		res.send(response.data.response.body.items)
  	}).catch(function (error) {
    	console.log(error)
  	})
})

// Fetch air data
app.get('/Airdata/:tmX/:tmY', (req, res) => {
	var stationName = ''
	axios.get('http://openapi.airkorea.or.kr/openapi/services/rest/MsrstnInfoInqireSvc/getNearbyMsrstnList?' +
		'tmX=' + req.params.tmX +
		'&tmY=' + req.params.tmY +
		'&pageNo=1&numOfRows=10' +
		'&ServiceKey=' + serviceKey +
		'&_returnType=json')
	.then(function (response) {
		stationName = response.data.list[response.data.list.length-1].stationName
		axios.get('http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty' +
			'?numOfRows=10' +
			'&pageNo=1' +
			'&stationName=' + encodeURIComponent(stationName) +
			'&dataTerm=DAILY' +
			'&ver=1.3' +
			'&ServiceKey=' + serviceKey +
			'&_returnType=json')
		.then(function (response2) {
			res.send(response2.data.list[0])
		}).catch(function (error) {
			console.log(error)
		})
	}).catch(function (error) {
    	console.log(error)
  	})
})

// Fetch workCode by _id
app.get('/wc/getWCById/:id', (req, res) => {
  Wc.find({}, '_id text bCode mCode sCode wCode', function (error, wcs) {
    if (error) { console.error(error); }
    res.send(wcs[0].bCode + wcs[0].mCode + wcs[0].sCode + wcs[0].wCode)
  })
  .where('_id').equals(req.params.id)
})

// Fetch _id by workCode 
app.get('/wc/getIdByWC/:code', (req, res) => {
  var db = req.db
  var code = req.params.code
  var bc = code.substring(0, 3)
  var mc = code.substring(3, 7)
  var sc = code.substring(7, 11)
  var wc = code.substring(11, 15)
  Wc.find({}, '_id text bCode mCode sCode wCode', function (error, wcs) {
    if (error) { console.error(error); }
    res.send(wcs)
  })
  .where('bCode').equals(bc)
  .where('mCode').equals(mc)
  .where('sCode').equals(sc)
  .where('wCode').equals(wc)
})

// Fetch workcalss text by cropCode
app.get('/wc/getTxtByCC/:code', (req, res) => {
  var db = req.db
  var code = req.params.code
  var bc = code.substring(0, 3)
  var mc = code.substring(3, 7)
  var sc = code.substring(7, 11)
  Wc.find({}, 'text bCode mCode sCode wCode', function (error, wcs) {
    if (error) { console.error(error); }
    res.send(wcs)
  })
  .where('bCode').equals(bc)
  .where('mCode').equals(mc)
  .where('sCode').equals(sc)
})

// Fetch workclass text by code
app.get('/wc/getText/:code', (req, res) => {
  var db = req.db
  var code = req.params.code
  var bc = code.substring(0, 3)
  var mc = code.substring(3, 7)
  var sc = code.substring(7, 11)
  var wc = code.substring(11, 15)
  Wc.find({}, 'text', function (error, wcs) {
    if (error) { console.error(error); }
    res.send(wcs)
  })
  .where('bCode').equals(bc)
  .where('mCode').equals(mc)
  .where('sCode').equals(sc)
  .where('wCode').equals(wc)
})

// Fetch workClass by bCode, mCode, sCode
app.get('/wc/:bCode/:mCode/:sCode', (req, res) => {
  Wc.find({}, 'bCode mCode sCode wCode text', function (error, wcs) {
    if (error) { console.error(error); }
    res.send(wcs)
  })
  .where('bCode').equals(req.params.bCode)
  .where('mCode').equals(req.params.mCode)
  .where('sCode').equals(req.params.sCode)
  .sort({wCode:-1})
})

// Fetch workClass with BCP
app.get('/wc/getBCP', (req, res) => {	  
  Wc.distinct('text', {bCode:'BCP'}, function  (error, wcs) {
  	if (error) { console.error(error); }
  	res.send(wcs)
  })
})

// Fetch BCP detail
app.get('/wc/getBCPDetail/:bcpText', (req, res) => {	  
	Wc.findOne({bCode:'BCP', text: req.params.bcpText}, 'bCode mCode sCode wCode text', function (error, wcs) {
		if (error) { console.error(error) }
		res.send(wcs)
	})
})

// Fetch workClass with BAL
app.get('/wc/getBAL', (req, res) => {	  
  Wc.distinct('text', {bCode:'BAL'}, function  (error, wcs) {
  	if (error) { console.error(error); }
  	res.send(wcs)
  })
})

// Fetch BAL detail
app.get('/wc/getBALDetail/:balText', (req, res) => {	  
	Wc.findOne({bCode:'BAL', text: req.params.balText}, 'bCode mCode sCode wCode text', function (error, wcs) {
		if (error) { console.error(error) }
		res.send(wcs)
	})
})

// Add new workClass
app.post('/wc', (req, res) => {
  // console.log(req.body);
  var bCode = req.body.bCode;
  var mCode = req.body.mCode;
  var sCode = req.body.sCode;
  var wCode = req.body.wCode;
  var text = req.body.text;

  var new_wc = new Wc({
    bCode: bCode,
    mCode: mCode,
    sCode: sCode,
    wCode: wCode,
    text: text
  })

  new_wc.save(function (error, result) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Wc saved successfully!',
      result: result
    })
  })
})

// Update journal
app.put('/journals/:id', (req, res) => {
  var db = req.db;
  Journal.findById(req.params.id, 'userId name', function (error, journals) {
    if (error) { console.error(error); }

    journals.userId = req.body.userId;
    journals.date = req.body.date;
    journals.landId = req.body.landId;
    journals.workCode = req.body.workCode;
    journals.workContent = req.body.workContent;
  	journals.remarks = req.body.remarks

    journals.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
})

// Delete journal
app.delete('/journals/:id', (req, res) => {
	var db = req.db
	Journal.remove({
		_id: req.params.id
	}, function(err, lands) {
		if (err) {
			res.send(err)
		}
		res.send({
			success: true
		})
	})
})

// Fetch journals by userId, startDate, endDate, landId
app.get('/journals/searchWorktime/:userId/:startDate/:endDate/:landId', (req, res) => {  
  // console.log(req.params)
  var query = Journal.find({})
  if(0 != req.params.startDate) {
  	query.where('date').gte(req.params.startDate)
  }
  if(0 != req.params.endDate) {
  	query.where('date').lte(req.params.endDate)
  }

  var userId = req.params.userId
  var landId = req.params.landId
 
  if(0 != userId) {
  	query.where('userId').equals(userId)
  }
  if(0 != landId) {
  	query.where('landId').equals(landId)
  }

  query.exec().then(result => {
  	res.send(result)
  })
})

// Fetch journals by date, workType, workContent
app.get('/journals/searchBy4/:startDate/:endDate/:workType/:workContent', (req, res) => {
  var db = req.db
  // console.log(req.params)
  var query = Journal.find({})
  if(0 != req.params.startDate) {
  	query.where('date').gte(req.params.startDate)
  }
  if(0 != req.params.endDate) {
  	query.where('date').lte(req.params.endDate)
  }

  var tmpWorkTypePrefix = req.params.workType.substring(0, 3)
  var tmpWorkTypeSuffix = req.params.workType.substring(3, 8)
 
  if(0 != req.params.workType) {
  	query.where('workCode').regex(tmpWorkTypePrefix)
  	query.where('workCode').regex(tmpWorkTypeSuffix)
  }
  if(0 != req.params.workContent) {
  	query.where('workContent').regex(req.params.workContent)
  }

  query.exec().then(result => {
  	res.send(result)
  })
})

// Fetch journals by year, month
app.get('/journals/searchByYM/:ym', (req, res) => {
  console.log(req.params)
  Journal.find({}, 'userId date landId workCode workContent workSTime workETime weather remarks', function (error, journals) {
    if (error) { console.error(error); }
    res.send(journals)
  })
  .where('date').regex(req.params.ym)
})

// Fetch journals by year, month, userId
app.get('/journals/searchByYMUserId/:ym/:userId', (req, res) => {
  console.log(req.params)
  Journal.find({}, 'userId date landId workCode workContent workSTime workETime weather remarks', function (error, journals) {
    if (error) { console.error(error); }
    res.send(journals)
  })
  .where('date').regex(req.params.ym)
  .where('userId').equals(req.params.userId)
})

// Fetch journals by date
app.get('/journals/:startDate/:endDate', (req, res) => {
  var db = req.db
  console.log(req.params)
  Journal.find({}, 'userId date landId workCode workContent workSTime workETime weather remarks', function (error, journals) {
    if (error) { console.error(error); }
    res.send(journals)
  })
  .where('date').gte(req.params.startDate).lte(req.params.endDate)
})

// Fetch journals by date & userId
app.get('/journals/:startDate/:endDate/:userId', (req, res) => {
  console.log(req.params)
  Journal.find({}, 'userId date landId workCode workContent workSTime workETime weather remarks', function (error, journals) {
    if (error) { console.error(error); }
    res.send(journals)
  })
  .where('date').gte(req.params.startDate).lte(req.params.endDate)
  .where('userId').equals(req.params.userId)
})

// Fetch journals by userId
app.get('/journals/:userId', (req, res) => {
  var db = req.db
  Journal.find({}, 'userId date landId workCode workContent workSTime workETime weather remarks', function (error, journals) {
    if (error) { console.error(error); }
    res.send(journals)
  })
  .where('userId').equals(req.params.userId)
})

// Fetch journal by id
app.get('/journal/:id', (req, res) => {
  var db = req.db
  Journal.find({}, '_id userId date landId workCode workContent workSTime workETime weather remarks', function (error, journals) {
    if (error) { console.error(error); }
    res.send(journals)
  })
  .where('_id').equals(req.params.id)
})

// Add new journal
app.post('/journals', (req, res) => {
  // console.log(req.body);
  var db = req.db;
  var userId = req.body.userId;
  var date = req.body.date;
  var landId = req.body.landId;
  var workCode = req.body.workCode;
  var workContent = req.body.workContent;
  var workSTime = req.body.workSTime;
  var workETime = req.body.workETime;
  var weather = [];
  for(var i = 0; i < req.body.weather.length; i++) {
  	weather[i] = new Object();
  	weather[i].baseTime = req.body.weather[i].baseTime;
  	weather[i].sky = req.body.weather[i].sky;
  	weather[i].t1h = req.body.weather[i].t1h;
  	weather[i].reh = req.body.weather[i].reh;
  	weather[i].rn1 = req.body.weather[i].rn1;
  }
  var remarks = req.body.remarks

  var new_journal = new Journal({
    userId: userId,
    date: date,
    landId: landId,
    workCode: workCode,
    workContent: workContent,
    workSTime: workSTime,
    workETime: workETime,
    weather: weather,
    remarks: remarks
  })

  new_journal.save(function (error, result) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Journal saved successfully!',
      result: result
    })
  })
})

// Fetch cropName by cropCode
app.get('/sc/getCN/:cropCode', (req, res) => {
  var db = req.db
  var cropCode = req.params.cropCode
  var bc = cropCode.substring(0, 3)
  var mc = cropCode.substring(3, 7)
  var sc = cropCode.substring(7, 11)
  Sc.find({}, 'bCode mCode sCode text', function (error, scs) {
    if (error) { console.error(error); }
    res.send(scs)
  })
  .where('bCode').equals(bc)
  .where('mCode').equals(mc)
  .where('sCode').equals(sc)
})

// Fetch single smallClass
app.get('/sc/:cropName', (req, res) => {
  var db = req.db
  Sc.find({}, 'bCode mCode sCode text', function (error, scs) {
    if (error) { console.error(error); }
    res.send(scs)
  })
  .where('text').equals(req.params.cropName)
})

// Fetch smallClass by bCode, mCode
app.get('/sc/:bCode/:mCode', (req, res) => {
  Sc.find({}, 'bCode mCode sCode text', function (error, scs) {
    if (error) { console.error(error); }
    res.send({
      scs: scs
    })
  })
  .where('bCode').equals(req.params.bCode)
  .where('mCode').equals(req.params.mCode)
  .sort({text:1})
})

// Fetch all smallClass
app.get('/sc', (req, res) => {
  Sc.find({}, 'bCode mCode sCode text', function (error, scs) {
    if (error) { console.error(error); }
    res.send({
      scs: scs
    })
  })
  .sort({text:1})
})

// Fetch mediumClass by bCode
app.get('/mc/:bCode', (req, res) => {
  Mc.find({}, 'bCode mCode text', function (error, mcs) {
    if (error) { console.error(error); }
    res.send({
      mcs: mcs
    })
  })
  .where('bCode').equals(req.params.bCode)
  .sort({text:1})
})

// Fetch mediumClass text by bCode mCode
app.get('/mc/:bCode/:mCode', (req, res) => {
  Mc.find({}, 'bCode mCode text', function (error, mcs) {
    if (error) { console.error(error); }
    res.send({
      mcs: mcs
    })
  })
  .where('bCode').equals(req.params.bCode)
  .where('mCode').equals(req.params.mCode)
  .sort({text:1})
})

// Fetch all mediumClass
app.get('/mc', (req, res) => {
  Mc.find({}, 'bCode mCode text', function (error, mcs) {
    if (error) { console.error(error); }
    res.send({
      mcs: mcs
    })
  })
  .sort({text:1})
})

// Fetch all bigClass
app.get('/bc', (req, res) => {
  Bc.find({}, 'bCode text', function (error, bcs) {
    if (error) { console.error(error); }
    res.send({
      bcs: bcs
    })
  })
  .sort({text:1})
})

// Fetch bigClass text by bCode
app.get('/bc/:bCode', (req, res) => {
  Bc.find({}, 'bCode text', function (error, bcs) {
    if (error) { console.error(error); }
    res.send({
      bcs: bcs
    })
  })
  .where('bCode').equals(req.params.bCode)
  .sort({text:1})
})

// Fetch name by landId
app.get('/lands/getName/:id', (req, res) => {
  Land.find({}, 'name', function (error, lands) {
    if (error) { console.error(error); }
    res.send(lands)
  })
  .where('_id').equals(req.params.id)
})

// Fetch cropCode by landId
app.get('/lands/getCC/:id', (req, res) => {
  Land.find({}, 'cropCode', function (error, lands) {
    if (error) { console.error(error); }
    res.send(lands)
  })
  .where('_id').equals(req.params.id)
})

// Add new land
app.post('/lands', (req, res) => {
  var db = req.db;
  var userId = req.body.userId;
  var name = req.body.name;
  var address = req.body.address;
  var size = req.body.size;
  var cropCode = req.body.cropCode;
  var new_land = new Land({
    userId: userId,
    name: name,
    address: address,
    size: size,
    cropCode: cropCode
  })

  new_land.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Land saved successfully!'
    })
  })
})

// Fetch all lands by userId
app.get('/lands/:id', (req, res) => {
  Land.find({}, 'userId name address size cropCode', function (error, lands) {
    if (error) { console.error(error); }
    res.send({
      lands: lands
    })
  })
  .where('userId').equals(req.params.id)
  .sort({_id:-1})
})

// Update land
app.put('/lands/:id', (req, res) => {
  var db = req.db;
  Land.findById(req.params.id, 'userId name', function (error, lands) {
    if (error) { console.error(error); }
    lands.name = req.body.name
    lands.address = req.body.address
    lands.size = req.body.size
    lands.cropCode = req.body.cropCode
    lands.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
})

// Delete land
app.delete('/lands/:id', (req, res) => {
	var db = req.db
	Land.remove({
		_id: req.params.id
	}, function(err, lands) {
		if (err) {
			res.send(err)
		}
		res.send({
			success: true
		})
	})
})

// Add new user
app.post('/user', (req, res) => {  
  var email = req.body.email;
  var password = req.body.password;
  var age = req.body.age;
  var sex = req.body.sex;
  var new_user = new User({
    email: email,
    password: password,
    age: age,
    sex: sex
  })

  new_user.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'User saved successfully!'
    })
  })
})

// Fetch single user
app.get('/user/:id', (req, res) => {
  var db = req.db
  User.findById(req.params.id, 'email password age sex', function (error, user) {
    if (error) { console.error(error); }
    res.send(user)
  })
})

// Update a user age & sex
app.put('/userAgeSex/:id', (req, res) => {
  var db = req.db;
  User.findById(req.params.id, 'age sex', function (error, user) {
    if (error) { console.error(error); }
    user.age = req.body.age
    user.sex = req.body.sex
    user.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
})

// Update a user password
app.put('/userPassword/:id', (req, res) => {
  var db = req.db;
  User.findById(req.params.id, 'age sex', function (error, user) {
    if (error) { console.error(error); }
    user.password = req.body.password

    user.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
})

// Fetch user by email
app.get('/user/byEmail/:email', (req, res) => {
  User.find({}, '_id', function (error, user) {
    if (error) { console.error(error); }
    res.send(user)
  })
  .where('email').equals(req.params.email)
})

// Fetch user by email & pw
app.get('/user/:email/:pw', (req, res) => {
  console.log(req.params)
  User.find({}, '_id', function (error, user) {
    if (error) { console.error(error); }
    res.send(user)
  })
  .where('email').equals(req.params.email)
  .where('password').equals(req.params.pw)
})
*/