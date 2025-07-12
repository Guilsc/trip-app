<template>
  <q-layout view="hHh lpR fFf">
    <q-header v-if="showToolbar" elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="row items-center">
          <q-icon name="flight" size="2rem" class="q-mr-sm" />
          <span class="text-h6">Trip App</span>
        </q-toolbar-title>

        <div v-if="authStore.isAuthenticated" class="row items-center">
          <q-btn-dropdown flat color="white" icon="person">
            <q-list>
              <q-item clickable v-close-popup @click="handleLogout">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>Sair</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useQuasar } from 'quasar'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const $q = useQuasar()
const route = useRoute()

const hideToolbarRoutes = ['/login', '/register']
const showToolbar = computed(() => !hideToolbarRoutes.includes(route.path))

const handleLogout = () => {
  authStore.logout()
  $q.notify({
    type: 'positive',
    message: 'Logout realizado com sucesso!',
  })
  router.push('/login')
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
