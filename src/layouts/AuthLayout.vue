<template>
  <q-layout>
    <q-page-container>
      <q-page class="auth-page" :style="{ backgroundImage: `url(${bgImage})` }">
        <div class="auth-container">
          <q-card class="auth-card">
            <q-card-section class="text-center q-pb-none">
              <div class="logo-section">
                <q-icon name="flight" size="4rem" color="primary" />
                <div class="text-h4 text-primary q-mt-md">Trip App</div>
              </div>
              <div class="text-subtitle1 text-grey-6 q-mt-md">{{ subtitle }}</div>
            </q-card-section>

            <q-card-section>
              <router-view />
            </q-card-section>

            <q-card-section class="text-center q-pt-none">
              <div class="text-body2 text-grey-6">
                {{ footerText }}
                <router-link :to="footerLink.to" class="text-primary text-weight-medium">
                  {{ footerLink.text }}
                </router-link>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import loginBg from '@/assets/login-bg.jpg'
import registerBg from '@/assets/register-bg.jpg'

const route = useRoute()

const bgImage = computed(() => {
  return route.path === '/login' ? loginBg : registerBg
})

const subtitle = computed(() => {
  return route.path === '/login' ? 'Faça login para acessar sua conta' : 'Crie sua conta para começar'
})

const footerText = computed(() => {
  return route.path === '/login' ? 'Não tem uma conta?' : 'Já tem uma conta?'
})

const footerLink = computed(() => {
  return route.path === '/login'
    ? { to: '/register', text: 'Criar conta' }
    : { to: '/login', text: 'Fazer login' }
})
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background-size: 700px auto;
  background-repeat: no-repeat;
  background-position: left center;
  display: flex;
  align-items: center;
  justify-content: right;
  padding: 10rem;
  background-color: #ffece3;
}

.auth-container {
  width: 100%;
  max-width: 400px;
}

.auth-card {
  border-radius: 16px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.text-h4 {
  font-size: 2rem;
  font-weight: 600;
}

.text-subtitle1 {
  font-size: 1.1rem;
}

.text-body2 {
  font-size: 0.9rem;
}

.text-weight-medium {
  font-weight: 500;
}
</style>
