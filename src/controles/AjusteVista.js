/**
 * @module controles/AjusteVista
 */

import Control from 'ol/control/Control'
import { crearContenedorControl, crearBotonControl } from './utiles'
import { eventos } from '../composables/usarMapa'
import { extensionEsValida } from '../utiles'

/**
 * @property {String} claseCss clase del elemnto HTML del control. La clase se concatenará con la
 * clase genérica `sisdai-mapa-control-${claseCss}`.
 */
const claseCss = 'ajuste-vista'

/**
 * Relleno (en píxeles) que se agregará a la extensión de la vista. Los valores en la matriz son
 * relleno: [superior, derecho, inferior, izquierdo] y solo es aplicable cuando la extensión es
 * definida.
 */
const rellenoAlBordeDeLaExtension = [10, 10, 10, 10]

/**
 *
 */
let emit

/**
 *
 */

/**
 * @classdesc
 * Agrega un control personalizado que permite volver a la vista del mapa que se definió
 * inicialmente.
 */
export default class AjusteVista extends Control {
  /**
   * Nombre con el que se podrá extraer el control del mapa.
   * @type {String}
   */
  static nombre = 'AjusteVista'

  /**
   * Acceder al nombre estatico desde el objeto instanciado.
   * @returns {String}
   */
  get nombre() {
    return AjusteVista.nombre
  }

  constructor(_emit) {
    emit = _emit
    /**
     * Elemento contenedor del control
     * @type {HTMLDivElement}
     * @private
     */
    const contenedorControl = crearContenedorControl(claseCss)

    super({
      element: contenedorControl,
      target: undefined,
    })

    /**
     * Elemento clickable del control
     * @type {HTMLButtonElement}
     * @private
     */
    this.botonAjustarVista = crearBotonControl(
      claseCss,
      'mapa-centro',
      this.ajustar.bind(this)
    )
    contenedorControl.appendChild(this.botonAjustarVista)

    /**
     *
     */
    alIniciarMapa(this).then(() => this.ajustar())
  }

  /**
   *
   * @returns
   */
  get extensionCapasVisibles() {
    const extensiones = this.getMap()
      .getLayers()
      .getArray()
      .filter(
        capa => capa.getVisible() && extensionEsValida(capa.get('extension'))
      )
      .map(capa => capa.get('extension'))

    return extensiones.length > 0 ? calcularLimites(extensiones) : undefined
  }

  /**
   *
   */
  get extension() {
    const extension = this.getMap().get('vista').extension

    return extensionEsValida(extension) ? extension : undefined
  }

  /**
   *
   */
  get olView() {
    return this.getMap().getView()
  }

  /**
   *
   * @param {*} extencion
   */
  ajustarPorExtension(extencion) {
    this.olView.fit(extencion, {
      padding: rellenoAlBordeDeLaExtension,
      duration: 1000,
    })
  }

  /**
   *
   * @param {*} vista
   */
  ajustarPorCentroZoom(vista) {
    this.olView.animate({ zoom: vista.zoom, center: vista.centro })
  }

  /**
   *
   */
  ajustar() {
    const vista = this.getMap().get('vista')

    if (vista.ajustePorCapas && this.extensionCapasVisibles) {
      this.ajustarPorExtension(this.extensionCapasVisibles)
    } else if (vista.tipo === 'extension') {
      this.ajustarPorExtension(this.extension)
    } else {
      this.ajustarPorCentroZoom(vista)
    }

    emit(eventos.alAjustarVista)
    this.dispatchEvent('reset')
  }
}

/**
 *
 * @param {*} _this
 * @returns
 */
function alIniciarMapa(_this) {
  return new Promise(resolve => {
    // const _this = this
    function revisarMapa() {
      if (_this.getMap()) {
        resolve(_this.getMap())
      } else setTimeout(revisarMapa, 50)
    }

    revisarMapa()
  })
}

/**
 * Calcula los límites de las estenciones que llegen cómo parámetro.
 * @param {Array} extensiones Arreglo de extenciones en formato [x1, y1, x2, y2].
 * @returns {Array} Bbox de las extenciones en formato [x1, y1, x2, y2].
 */
function calcularLimites(extensiones) {
  return [
    Math.min(...extensiones.map(ext => ext[0])),
    Math.min(...extensiones.map(ext => ext[1])),
    Math.max(...extensiones.map(ext => ext[2])),
    Math.max(...extensiones.map(ext => ext[3])),
  ]
}
