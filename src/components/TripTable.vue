<template>
  <q-table
    flat bordered
    title="Minhas Viagens"
    :rows="rows"
    :columns="columns"
    row-key="id"
  >
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn icon="edit" size="sm" flat dense @click="$emit('edit-trip', props.row)" :disable="!isAdmin" />
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
const props = defineProps<{
  rows: any[],
  columns: any[],
  isAdmin: boolean
}>()
</script>

