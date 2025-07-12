<template>
  <q-card class="q-pa-md q-mb-md" flat bordered>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-input dense outlined v-model="filter.destination" label="Destino" />
      </div>
      <div class="col-12 col-md-6">
        <q-select
          dense
          outlined
          v-model="filter.status"
          multiple
          :options="statusOptions"
          label="Status"
        />
      </div>
    </div>
    <div class="row justify-end q-mt-md">
      <q-btn flat color="primary" label="Limpar Filtros" @click="$emit('clear-filters')" />
      <q-btn color="secondary" class="q-ml-sm" label="Aplicar Filtros" @click="$emit('apply-filters')" />
    </div>
  </q-card>
</template>

<script setup lang="ts">
const props = defineProps<{
  filter: any,
  statusOptions: any[]
}>()
</script>

