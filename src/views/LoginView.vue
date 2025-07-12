<template>
  <q-page class="login-page">
    <div class="login-container">
      <q-card class="login-card">
        <q-card-section class="text-center q-pb-none">
          <div class="logo-section">
            <q-icon name="flight" size="4rem" color="primary" />
            <div class="text-h4 text-primary q-mt-md">Trip App</div>
          </div>
          <div class="text-subtitle1 text-grey-6 q-mt-md">Faça login para acessar sua conta</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="handleLogin">
            <q-input
              class="full-width q-pa-md"
              v-model="form.email"
              label="Email"
              type="email"
              outlined
              dense
              :rules="[(val) => !!val || 'Email é obrigatório']"
            >
              <template v-slot:prepend>
                <q-icon name="mail" />
              </template>
            </q-input>

            <q-input
              v-model="form.password"
              class="full-width q-pa-md"
              label="Senha"
              :type="showPassword ? 'text' : 'password'"
              outlined
              dense
              :rules="[(val) => !!val || 'Senha é obrigatória']"
            >
              <template v-slot:prepend>
                <q-icon name="lock_outline" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility' : 'visibility_off'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>

            <div class="flex q-my-lg q-mx-sm">
              <q-checkbox v-model="rememberMe" label="Lembrar de mim" />
              <q-btn class="q-ml-auto" flat color="primary" label="Esqueci a senha" no-caps />
            </div >

            <div class="flex">
              <q-btn
                class="q-mx-auto"
                type="submit"
                color="primary"
                size="md"
                :loading="authStore.loading"
                :label="authStore.loading ? 'Entrando...' : 'Entrar'"
              />
            </div>

          </q-form>
        </q-card-section>

        <q-card-section class="text-center q-pt-none">
          <div class="text-body2 text-grey-6">
            Não tem uma conta?
            <router-link to="/register" class="text-primary text-weight-medium">
              Criar conta
            </router-link>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useQuasar } from 'quasar'

const router = useRouter()
const authStore = useAuthStore()
const $q = useQuasar()

const form = reactive({
  email: '',
  password: '',
})

const showPassword = ref(false)
const rememberMe = ref(false)

const handleLogin = async () => {
  try {
    const result = await authStore.login({
      email: form.email,
      password: form.password,
    })

    if (result.success) {
      $q.notify({
        type: 'positive',
        message: 'Login realizado com sucesso!',
      })
      router.push('/')
    } else {
      $q.notify({
        type: 'negative',
        message: result.error || 'Erro ao fazer login',
      })
    }
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro inesperado ao fazer login',
    })
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background-image: url('@/assets/login-bg.jpg');
  background-size: 700px auto;
  background-repeat: no-repeat;
  background-position: left center;
  display: flex;
  align-items: center;
  justify-content: right;
  padding: 10rem;
  background-color: #ffece3;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
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
