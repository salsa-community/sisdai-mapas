<script setup>
import { ref } from 'vue'

const mapa = ref({
  centro: [-102, 24],
  zoom: 4.5,
})

const osm = ref({
  id: 'osm-capa-id',
  nombre: 'Capa de OpenStreetMap',
  visible: true,
  zIndex: 0,
})

const wms = ref({
  id: 'wms-capa-id',
  nombre: 'Capa WMS de estados',
  parametros: { LAYERS: 'estados_inegi_2019' },
  url: 'https://geo.crip.conacyt.mx/geoserver/estados_inegi_2019/wms',
  visible: false,
  zIndex: 2,
})
</script>

<template>
  <SisdaiMapa
    :centro="mapa.centro"
    :zoom="mapa.zoom"
  >
    <SisdaiMapaEncabezado>
      Cotroles que no son del mapa
      <div class="inline">
        WMS:
        <button
          class="boton-secundario boton-chico"
          @click="wms.visible = !wms.visible"
        >
          {{ wms.visible ? 'Apagar' : 'Prender' }}
        </button>
        <input
          type="text"
          v-model="wms.nombre"
        />
      </div>

      <hr />
      Controles del mapa
      <SisdaiMapaLeyenda :para="wms.id" />
      <SisdaiMapaLeyenda :para="osm.id" />
    </SisdaiMapaEncabezado>

    <SisdaiMapaCapas>
      <SisdaiCapaOsm
        :id="osm.id"
        :nombre="osm.nombre"
        :visible="osm.visible"
        :zIndex="osm.zIndex"
      />

      <SisdaiCapaWms
        :id="wms.id"
        :nombre="wms.nombre"
        :parametros="wms.parametros"
        :url="wms.url"
        :visible="wms.visible"
        :zIndex="wms.zIndex"
        @alCambiarVisibilidad="v => (wms.visible = v)"
      />
    </SisdaiMapaCapas>
  </SisdaiMapa>
</template>

<style lang="scss">
.inline {
  display: flex;
  input[type='text'] {
    margin: 0 !important;
  }
}
</style>
