<template>
  <div class="page">
    <div class="card">
      <div class="card-section text-center q-pa-md">
        <div class="text-h3 text-tertiary q-mb-md">
          <q-icon name="flight" size="4rem" color="secondary" />
          Bem-vindo ao Trip App!
        </div>
        <div class="text-h6 text-grey-7 q-mb-lg">Olá, {{ authStore.user?.name }}! 👋</div>
        <div class="text-body1 text-grey-6 q-mb-xl">
          Sua aplicação de gerenciamento de viagens está pronta para uso.
        </div>
        <q-btn color="secondary" label="Criar Viagem" @click="openCreateTripDialog" />
      </div>

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
          <q-btn flat color="primary" label="Limpar Filtros" @click="clearFilters" />
          <q-btn color="secondary" class="q-ml-sm" label="Aplicar Filtros" @click="applyFilters" />
        </div>
      </q-card>

      <div class="q-mt-xl">
        <q-table
          flat bordered
          title="Minhas Viagens"
          :rows="filteredTrips"
          :columns="columns"
          row-key="id"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn icon="edit" size="sm" flat dense @click="openEditTripDialog(props.row)" :disable="authStore.user?.role !== 'admin'" />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <q-dialog v-model="showCreateTripDialog">
      <q-card style="width: 500px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Criar Nova Viagem</div>
        </q-card-section>

        <q-card-section>
          <q-input dense class="q-mb-md" outlined v-model="newTrip.destination" label="Destino" />
          <q-input dense class="q-mb-md" outlined v-model="newTrip.departure_date" label="Data de Partida" type="date" stack-label />
          <q-input dense outlined v-model="newTrip.return_date" label="Data de Retorno" type="date" stack-label />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn label="Criar" color="secondary" @click="createTrip" :disable="isCreateTripFormInvalid" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showEditTripDialog">
      <q-card style="width: 500px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Editar Status da Viagem</div>
        </q-card-section>

        <q-card-section>
          <q-select
            dense
            outlined
            v-model="selectedStatus"
            :options="editStatusOptions"
            label="Status"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn label="Salvar" color="secondary" @click="updateTripStatus" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { tripService } from '@/services/api'
import { QTableColumn, useQuasar } from 'quasar'

const authStore = useAuthStore()
const originalTrips = ref<any[]>([])

const appliedFilter = ref({
  dateRange: null,
  destination: '',
  status: [],
})

const filter = ref({
  dateRange: null,
  destination: '',
  status: [],
})

const filteredTrips = computed(() => {
  let currentTrips = originalTrips.value

  // Filtra por destino
  if (appliedFilter.value.destination) {
    currentTrips = currentTrips.filter((trip: any) =>
      trip.destination.toLowerCase().includes(appliedFilter.value.destination.toLowerCase())
    )
  }

  // Filtra por status
  if (appliedFilter.value.status && appliedFilter.value.status.length > 0) {
    const selectedStatuses = appliedFilter.value.status.map((s: any) => s.value)
    currentTrips = currentTrips.filter((trip: any) =>
      selectedStatuses.includes(trip.status.name.toLowerCase())
    )
  }

  return currentTrips
})

const showCreateTripDialog = ref(false)
const showEditTripDialog = ref(false)
const selectedTrip = ref<any>(null)
const selectedStatus = ref<any>(null)
const $q = useQuasar()

const statusOptions = [
  { label: 'Aprovado', value: 'aprovado' },
  { label: 'Solicitado', value: 'solicitado' },
  { label: 'Cancelado', value: 'cancelado' }
]

const editStatusOptions = computed(() => {
  if (!selectedTrip.value) return []
  return statusOptions.filter(option => option.value !== selectedTrip.value.status.name)
})

const newTrip = ref({
  destination: '',
  departure_date: '',
  return_date: '',
})

const isCreateTripFormInvalid = computed(() => {
  return !newTrip.value.destination || !newTrip.value.departure_date || !newTrip.value.return_date
})

const columns: QTableColumn[] = [
  { name: 'destination', align: 'left', label: 'Destino', field: 'destination', sortable: true },
  { name: 'departure_date', align: 'left', label: 'Data de Partida', field: 'departure_date', sortable: true, format: (val) => new Date(val).toLocaleDateString() },
  { name: 'return_date', align: 'left', label: 'Data de Retorno', field: 'return_date', sortable: true, format: (val) => new Date(val).toLocaleDateString() },
  { name: 'status', align: 'center', label: 'Status', field: (row) => row.status.name.toLocaleLowerCase(), sortable: true },
  { name: 'actions', align: 'right', label: 'Ações', field: 'actions' }
]

const fetchTrips = async () => {
  try {
    const response = await tripService.listTripRequests()
    originalTrips.value = response.data
  } catch (error) {
    console.error('Erro ao buscar viagens:', error)
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar as viagens.',
    })
  }
}

const applyFilters = () => {
  appliedFilter.value = { ...filter.value }
}

const clearFilters = () => {
  filter.value = {
    dateRange: null,
    destination: '',
    status: [],
  }
  appliedFilter.value = { ...filter.value }
}

onMounted(fetchTrips)

const openCreateTripDialog = () => {
  newTrip.value = {
    destination: '',
    departure_date: '',
    return_date: '',
  }
  showCreateTripDialog.value = true
}

const openEditTripDialog = (trip: any) => {
  selectedTrip.value = trip
  selectedStatus.value = null
  showEditTripDialog.value = true
}

const updateTripStatus = async () => {
  if (!selectedTrip.value || !selectedStatus.value) return

  try {
    await tripService.updateTripRequestStatus(selectedTrip.value.id, { status: selectedStatus.value.value })
    showEditTripDialog.value = false
    $q.notify({
      type: 'positive',
      message: 'Status da viagem atualizado com sucesso!',
    })
    fetchTrips() // Atualiza a lista de viagens
  } catch (err: any) {
    console.log(err.response.data['error']);
    let errorMessage = 'Ocorreu um erro ao atualizar o status da viagem.';
    if (err.response && err.response.data && err.response.data['error']) {
      errorMessage = err.response.data['error'];
    } else if (err.response && err.response.data && err.response.data.errors.status) {
        errorMessage = err.response.data.errors.status[0];
    }
    $q.notify({
      type: 'negative',
      message: errorMessage,
    })
    console.error('Erro ao atualizar status da viagem:', err)
  }
}

const createTrip = async () => {
  try {
    await tripService.createTripRequest(newTrip.value)
    showCreateTripDialog.value = false
    $q.notify({
      type: 'positive',
      message: 'Viagem criada com sucesso!',
    })
    fetchTrips() // Atualiza a lista de viagens
  } catch (err: any) {
    let errorMessage = 'Ocorreu um erro ao criar a viagem.';
    if (err.response && err.response.data && err.response.data.errors) {
      const errorKey = Object.keys(err.response.data.errors)[0];
      errorMessage = err.response.data.errors[errorKey][0];
    } else if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message
    }
    $q.notify({
      type: 'negative',
      message: errorMessage,
    })
    console.error('Erro ao criar viagem:', err)
  }
}

</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 2rem;
}

.card {
  border-radius: 16px;
  background: white;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
