<template>
  <q-page class="register-page">
    <div class="register-container">
      <q-card class="register-card">
        <q-card-section class="text-center q-pb-none">
          <div class="logo-section">
            <q-icon name="flight" size="4rem" color="primary" />
            <div class="text-h4 text-primary q-mt-md">Trip App</div>
          </div>
          <div class="text-subtitle1 text-grey-6 q-mt-md">Crie sua conta para começar</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="handleRegister" class="q-gutter-md q-pa-md">
            <q-input
              v-model="form.name"
              label="Nome completo"
              outlined
              dense
              :rules="[(val) => !!val || 'Nome é obrigatório']"
            >
              <template v-slot:prepend>
                <q-icon name="person_outline" />
              </template>
            </q-input>

            <q-input
              v-model="form.email"
              label="Email"
              type="email"
              outlined
              dense
              :rules="[
                (val) => !!val || 'Email é obrigatório',
                (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Email inválido',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="mail" />
              </template>
            </q-input>

            <q-input
              v-model="form.password"
              label="Senha"
              :type="showPassword ? 'text' : 'password'"
              outlined
              dense
              :rules="[
                (val) => !!val || 'Senha é obrigatória',
                (val) => val.length >= 6 || 'Senha deve ter pelo menos 6 caracteres',
              ]"
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

            <q-input
              v-model="form.confirmPassword"
              label="Confirmar senha"
              :type="showConfirmPassword ? 'text' : 'password'"
              outlined
              dense
              :rules="[
                (val) => !!val || 'Confirmação de senha é obrigatória',
                (val) => val === form.password || 'Senhas não coincidem',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="lock_outline" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showConfirmPassword ? 'visibility' : 'visibility_off'"
                  class="cursor-pointer"
                  @click="showConfirmPassword = !showConfirmPassword"
                />
              </template>
            </q-input>

            <div class="row items-center q-mt-md">
              <q-checkbox
                v-model="acceptTerms"
                label="Concordo com os termos de uso e política de privacidade"
              />
            </div>

            <div class="flex">
              <q-btn
                type="submit"
                color="primary"
                size="md"
                :disabled="!acceptTerms"
                class="q-mt-lg q-mx-auto"
                :loading="authStore.loading"
                :label="authStore.loading ? 'Criando conta...' : 'Criar conta'"
              />
            </div>

          </q-form>
        </q-card-section>

        <q-card-section class="text-center q-pt-none">
          <div class="text-body2 text-grey-6">
            Já tem uma conta?
            <router-link to="/login" class="text-primary text-weight-medium">
              Fazer login
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
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const acceptTerms = ref(false)

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    $q.notify({
      type: 'negative',
      message: 'Senhas não coincidem',
    })
    return
  }

  if (!acceptTerms.value) {
    $q.notify({
      type: 'negative',
      message: 'Você deve aceitar os termos de uso',
    })
    return
  }

  try {
    const result = await authStore.register({
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.confirmPassword,
    })

    if (result.success) {
      $q.notify({
        type: 'positive',
        message: 'Conta criada com sucesso!',
      })
      router.push('/')
    } else {
      $q.notify({
        type: 'negative',
        message: result.error || 'Erro ao criar conta',
      })
    }
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro inesperado ao criar conta',
    })
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background-image: url('@/assets/register-bg.jpg');
  background-size: 600px auto;
  background-repeat: no-repeat;
  background-position: left center;
  display: flex;
  align-items: center;
  justify-content: right;
  padding: 10rem;
  background-color: #ffece3;
}

.register-container {
  width: 100%;
  max-width: 400px;
}

.register-card {
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
