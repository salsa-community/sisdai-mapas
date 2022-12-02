/**
 * @module composables/usarMapa
 */

import { ref, toRefs, watch } from 'vue'
// import MapEventType from 'ol/MapEventType'
import ControlEscalaGrafica from './../controles/EscalaGrafica'
import ControlVistaInicial from './../controles/VistaInicial'
import usarCapasRegistradas from './usarCapasRegistradas'
import vistaMapaDefault from './../defaults/vistaMapa'
import { extensionEsValida } from './../utiles'

/**
 * Objeto que contendrá la instancia del mapa, declararlo fuera de la función composable hace que
 * no se genere una nueva variable del mapa cada que se utilice el composable
 */
const olMapa = ref(undefined)

export const props = {
  /**
   * centro
   * - Tipo: `Array`
   * - Valor por defecto: `[0, 0]`
   * - Interactivo: ✅
   *
   * Coordenadas `[x, y]` del centro inicial de la vista.
   *
   * > ℹ️ **Información:** La proyección de estas coordenadas deben coincidir con la `proyeccion`
   * definida en el mapa.
   *
   * > ⚠️ **Importante:** Debe tener en cuenta que si la propiedad `extension` se define, esta
   * propiedad será ignorada.
   */
  centro: {
    type: Array,
    default: () => [0, 0],
  },

  /**
   * extension
   * - Tipo: `Array`
   * - Valor por defecto: `[0, 0, 0, 0]`
   * - Interactivo: ✅
   *
   * Coordenadas extremas `[x1, y1, x2, y2]` de la caja envolvente de la vista.
   *
   * > ℹ️ **Información:** La proyección de estas coordenadas deben coincidir con la `proyeccion`
   * definida en el mapa.
   *
   * > ⚠️ **Importante:** Debe tener en cuenta que si esta propiedad es definida o diferente al
   * valor por defecto, las propiedades `centro` y `zoom` serán ignoradas.
   */
  extension: {
    type: Array,
    default: () => [0, 0, 0, 0],
  },

  /**
   * `ajustarVistaPorCapasVisibles`
   * - Tipo: `Boolean`
   * - Valor por defecto: `false`
   * - Interactivo: ✅
   *
   * Define si al presionar el botón que ajusta la vista, se aplicará el zoom a las capas
   * visibles que tengan una extensión definida.
   */
  ajustarVistaPorCapasVisibles: {
    type: Boolean,
    default: false,
  },

  /**
   * Ver el icono de Conacyt debajo del mapa
   * @deprecated??
   */
  iconoConacytVisible: {
    type: Boolean,
    default: true,
  },

  /**
   * proyeccion
   * - Tipo: `String`
   * - Valor por defecto: `EPSG:4326`
   * - Interactivo: ❌
   *
   * Código de identificación SRS que define la proyección de la vista.
   *
   * > ℹ️ **Información:** El valor predeterminado es Universal Transversal de Mercator.
   */
  proyeccion: {
    type: String,
    default: 'EPSG:4326',
  },

  /**
   * Tema de la disposición de elemntos de apoyo del mapa (contenedor del header, pie y columnas
   * laterales)
   */
  tema: {
    type: String,
    default: '',
  },

  /**
   *
   */
  vista: {
    type: Object,
    default: () => vistaMapaDefault,
    validator: valor => {
      if (Number(valor.zoom) < 0 && Number(valor.zoom) > 22) {
        console.error('El valor del zoom debe ser entre 0 y 22')
        return false
      }

      return true
    },
  },

  /**
   * zoom
   * - Tipo: `Number`
   * - Valor por defecto: `1`
   * - Interactivo: ✅
   *
   * Nivel de zoom utilizado para calcular la resolución inicial de la vista.
   *
   * > ⚠️ **Importante:** Debe tener en cuenta que si la propiedad `extension` se define, esta
   * propiedad será ignorada.
   */
  zoom: {
    type: Number,
    default: 1,
  },

  /**
   * escalaGrafica
   * - Tipo: `Boolean`
   * - Valor por defecto: `false`
   * - Interactivo: ✅
   *
   * Define si se agrega la escala gráfica en el mapa.
   */
  escalaGrafica: {
    type: Boolean,
    default: true,
    validator: valor => typeof valor === typeof Boolean(),
  },
}

export const eventos = {
  alAjustarVista: 'alAjustarVista',
}

export const emits = Object.values(eventos)

/**
 * Uso del mapa, la finalidad de este composable es acceder al mapa desde diferentes componentes
 * o composables
 * @returns {Function} composable
 */
export default function usarMapa(propsParam) {
  const {
    agregarTodoALMapa: agregarCapasRegistradas,
    limpiarRegistro: limpiarCapasRegistradas,
    hayCapasCargadorVisibleProcesando: verCargador,
  } = usarCapasRegistradas()
  const {
    centro,
    escalaGrafica,
    extension,
    ajustarVistaPorCapasVisibles,
    vista,
    zoom,
  } = toRefs(propsParam)

  function asignarProps(mapaInstanciado) {
    const _vista = { ...vistaMapaDefault, ...vista.value }
    _vista.tipo = extensionEsValida(_vista.extension) ? 'extension' : 'centro'
    _vista.ajustePorCapas = ajustarVistaPorCapasVisibles.value
    mapaInstanciado.set('vista', _vista)
    // emitsParam(eventos.alAjustarVista)
  }

  /**
   * Guarda el objeto del mapa en una variable reactiva.
   * @param {import("ol/Map.js").default} mapaInstanciado
   */
  function salvarInstancia(mapaInstanciado) {
    asignarProps(mapaInstanciado)
    agregarCapasRegistradas(mapaInstanciado)
    olMapa.value = mapaInstanciado
    // olMapa.value.set(
    //   'ajustarVistaPorCapasVisibles',
    //   ajustarVistaPorCapasVisibles.value
    // )

    // olMapa.value.on(MapEventType.LOADSTART, console.log(MapEventType.LOADSTART))
    // olMapa.value.on(MapEventType.LOADEND, console.log(MapEventType.LOADEND))
  }

  /**
   * Invoca la limpieza de las capas registradas y reinicia el valor del mapa instanciado.
   */
  function desmontar() {
    limpiarCapasRegistradas()
    olMapa.valor = undefined
  }

  /**
   * Devuelve un control por su nombre registrado
   * @param {String} nombreDelControl
   * @returns {import("ol/control/Control.js").default|undefined} olControl
   */
  function conseguirControl(nombreDelControl) {
    if (olMapa.value) {
      return olMapa.value
        .getControls()
        .getArray()
        .find(olControl => olControl.nombre === nombreDelControl)
    }
  }

  /**
   * Agrega un control de openlayers en el mapa.
   * @param {import("ol/control/Control.js").default} olControl
   */
  function agregarControl(olControl) {
    if (olMapa.value) {
      olMapa.value.addControl(olControl)
    }
  }

  /**
   * Quita un control de openlayers en el mapa.
   * @param {import("ol/control/Control.js").default} olControl
   */
  function removerControl(olControl) {
    if (olMapa.value) {
      olMapa.value.removeControl(olControl)
    }
  }

  /**
   * Actualiza la coordenada centrica del mapa
   * @param {Number} centro nueva coordenada centrica
   */
  function cambiarCentro(centro) {
    if (olMapa.value) {
      olMapa.value.getView().setCenter(centro)
    }
  }
  watch(centro, cambiarCentro)

  /**
   * Quita o agrega el control de escala gáfica en el mapa dependiendo del parámetro boleano.
   * @param {Boolean} visible
   */
  function alternarEscalaGrafica(visible) {
    if (visible) {
      agregarControl(new ControlEscalaGrafica())
    } else {
      removerControl(conseguirControl(ControlEscalaGrafica.nombre))
    }
  }
  watch(escalaGrafica, alternarEscalaGrafica)

  /**
   * Cambiar la extension, esto proboca que el mapa ajuste la vista con la extención actual
   * en caso de ser valida.
   * @param {Array<Number>} extension
   */
  function cambiarExtension(nuevaExtension) {
    const controlVistaInicial = conseguirControl(ControlVistaInicial.nombre)
    controlVistaInicial.extension = nuevaExtension
    controlVistaInicial.reiniciarVista()
  }
  watch(extension, cambiarExtension)

  /**
   * Actualiza el nivel de zoom en el mapa.
   * @param {Number} zoom nuevo bnivel de zoom
   */
  function cambiarZoom(zoom) {
    if (olMapa.value) {
      olMapa.value.getView().setZoom(zoom)
    }
  }
  watch(zoom, cambiarZoom)

  return {
    salvarInstancia,
    desmontar,
    alternarEscalaGrafica,
    verCargador,
  }
}
