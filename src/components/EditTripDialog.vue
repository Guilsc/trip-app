<template>
  <q-dialog v-model="modelValue">
    <q-card style="width: 500px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">Editar Status da Viagem</div>
      </q-card-section>
      <q-card-section>
        <q-select
          dense
          outlined
          v-model="selectedStatus"
          :options="statusOptions"
          label="Status"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="primary" @click="$emit('cancel')" />
        <q-btn label="Salvar" color="secondary" @click="$emit('save', selectedStatus)" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean,
  selectedStatus: any,
  statusOptions: any[]
}>()
</script>

