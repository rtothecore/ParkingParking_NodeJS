<template>
  <v-layout align-center justify-center fill-height>
    <div
      id="e3"
      style="max-width: 400px; margin: auto;"
      class="grey lighten-3"
    >
      <v-toolbar
        color="blue"
        dark
      >
        <v-icon>fas fa-key</v-icon>
        <v-toolbar-title>로그인</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-card>
        <v-container
          fluid
          grid-list-lg
        >
          <v-layout row wrap justify-center>

            <v-flex xs12>
              
              <form>
                <v-text-field
                  prepend-icon="fas fa-envelope"
                  v-validate="'required'"
                  v-model="email"
                  :error-messages="errors.collect('email')"
                  label="이메일"
                  data-vv-name="email"
                ></v-text-field>

                <v-text-field
                  prepend-icon="fas fa-lock"
                  v-validate="'required'"
                  v-model="password"
                  :error-messages="errors.collect('password')"
                  :type="'password'"
                  label="비밀번호"
                  data-vv-name="password"
                  counter
                  v-on:keyup.enter="login"
                ></v-text-field>
                
                <p class="text-lg-right">
                  <v-btn color="warning" @click="goToRegister()">회원가입</v-btn>
                  <v-btn color="success" @click="login()">로그인</v-btn>
                </p>
              </form>

            </v-flex> 

          </v-layout>
        </v-container>
      </v-card>

      <registerModal></registerModal>

    </div>
  </v-layout>
</template>

<script>
import {bus} from '../main'
import UserService from '@/services/UserService'
export default {
  $_veeValidate: {
    validator: 'new'
  },
  data () {
    return {
      password: '',
      email: '',
      dictionary: {
        custom: {
          email: {
            required: () => '이메일주소를 입력해주세요'
          },
          password: {
            required: () => '비밀번호를 입력해주세요'
          }
        }
      }
    }
  },
  mounted () {
    this.$validator.localize('ko', this.dictionary)
  },
  methods: {
    async getUserByEmailNPw () {
      try {
        const response = await UserService.fetchUserByEmailNPw({
          email: this.email,
          pw: this.password
        })
        switch (response.status) {
          case 200 :
            const response2 = await UserService.fetchUserLevelByEmail({
              email: this.email
            })
            switch (response2.status) {
              case 200:
                if (response2.data[0].level === '1' || response2.data[0].level === '10') {
                  this.$swal({
                    type: 'success',
                    title: '로그인 성공',
                    showConfirmButton: false,
                    timer: 777
                  }).then((result) => {
                    this.$session.start()
                    this.$session.set('userId', response.data[0]._id)
                    this.$session.set('userLevel', response.data[0].level)
                    this.$router.push('/')
                  })
                } else {
                  this.$swal({
                    type: 'warning',
                    title: '권한없음 - 일반사용자는 접근할 수 없습니다',
                    showConfirmButton: false,
                    timer: 777
                  }).then((result) => {
                  })
                }
                break
              default :
                break
            }
            break
          case 201 :
            this.$swal({
              type: 'warning',
              title: '로그인 실패 - 존재하지 않는 이메일입니다',
              showConfirmButton: false,
              timer: 777
            }).then((result) => {
            })
            break
          case 202 :
            this.$swal({
              type: 'warning',
              title: '로그인 실패 - 비밀번호가 올바르지 않습니다',
              showConfirmButton: false,
              timer: 777
            }).then((result) => {
            })
            break
          default :
            break
        }
      } catch (e) {
        alert(e)
      }
    },
    login () {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return
        }
        this.getUserByEmailNPw()
      }).catch(() => {})
    },
    goToRegister () {
      bus.$emit('dialogForRegister')
    }
  },
  computed: {
  }
}
</script>