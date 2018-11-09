<template>
  <v-app v-if="$mq === 'laptop' || $mq === 'desktop'">
    <!-- https://pt.stackoverflow.com/questions/293349/background-image-com-vuetify -->
    <v-toolbar class="back" app>
      
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">
        {{ appTitle }}
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">

        <v-btn flat icon color="black" @click="logout()" v-show="btnLogOutSeen">
          <v-icon>fas fa-sign-out-alt</v-icon>
        </v-btn>

        <v-btn          
          flat
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
          :class="item.class">
          
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
          
        </v-btn>

        <!--
        <v-menu open-on-hover top offset-y>
          <v-btn
            slot="activator"
            flat
            class="statsImg"
          >
            <v-icon left dark>assessment</v-icon>통계
          </v-btn>

          <v-list>
            <v-list-tile
              v-for="(item, index) in subMenuItems"
              :key="index"
              @click="moveTo(item.path)"
            >
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        -->

      </v-toolbar-items>
    </v-toolbar>
    
    <!-- <v-content class="loginBack"> -->
    <v-content v-bind:class="{ loginBack: isBackImgActive }">
      <router-view></router-view>
    </v-content>
    
    <v-footer
      dark
      height="auto"
      v-if="$mq === 'laptop' || $mq === 'desktop'"
    >
      <v-card
        class="flex"
        flat
        tile
      >
        <v-card-actions class="grey darken-3 justify-center">
          (690-833) 제주특별자치도 제주시 고마로88(일도2동 378-19) 향천빌딩 2층<br/>
          TEL.064-753-6677   FAX.064-753-6676   MAIL.eziceo@gmail.com<br/>
          Copyright ⓒ EZ Information technology co.,Ltd. All right Reseved.
        </v-card-actions>
      </v-card>
    </v-footer>
  </v-app>

</template>
<script>
  export default {
    data () {
      return {
        isBackImgActive: false,
        btnLogOutSeen: false,
        appTitle: '주차관리 시스템',
        sidebar: false,
        menuItems: [
          {title: '사용자관리', path: '/', icon: 'assignment_turned_in', class: 'homeImg'},
          {title: '주차장관리', path: '/parkingManager', icon: 'assignment', class: 'searchImg'},
          {title: '주차장관리(맵)', path: '/parkingMap', icon: 'map', class: 'searchImg'},
          {title: '제보관리', path: '/reportManager', icon: 'assignment_late', class: 'predictImg'}
          /* {title: '통계', path: '/stats', icon: 'assessment'}, */
          // {title: '설정', path: '/config', icon: 'build', class: 'setImg'}
        ],
        subMenuItems: [
          { title: '작업시간', path: '/workTime' },
          { title: '환경모니터링', path: '/environment' }
        ]
      }
    },
    created () {
    },
    updated () {
      if (!this.$session.exists()) {
        this.btnLogOutSeen = false
        this.isBackImgActive = true
        this.$router.push('/login')
      } else {
        this.btnLogOutSeen = true
        this.isBackImgActive = false
      }
    },
    methods: {
      logout: function () {
        this.$session.destroy()
        this.btnLogOutSeen = false
        this.isBackImgActive = true
        this.$router.push('/login')
      },
      moveTo: function (val) {
        console.log(val)
        this.$router.push(val)
      }
    }
  }
</script>