<template>
  <!-- SOLO PARA COMPILAR, NO MANDAR AL PULL FROK -->
  <div class="legend-normal-vector">
    <!--TOdo lo que va adentro de checkbox es el label del mismo -->
    <checkbox v-model="visible" @change="set_visible_to_layer">
      <shape
        class="simbologia"
        :shapeType="classShape"
        :backgroundColor="
          usarTexturas ? 'transparent' : params.content.fill_color
        "
        :backgroundImage="backgroundImage"
        :strokeColor="params.content.stroke_color || 'white'"
        :strokeWidth="params.content.stroke_width || 1"
        :size="[
          (params.content.shape_radius || 12) * 2,
          (params.content.shape_radius || 12) * 2,
        ]"
        v-if="params.content.shape !== 'icon'"
      />
      <shape
        class="simbologia"
        v-if="params.content.shape === 'icon'"
        shapeType="image"
        :imageOptions="params.content.icon"
        :size="[
          (params.content.shape_radius || 12) * 2,
          (params.content.shape_radius || 12) * 2,
        ]"
      />
      <span>{{ params.content.title }}</span>
    </checkbox>
    <!-- legend-info -->
    <legend-info
      v-if="has_VM_info"
      :contenido="content_VM_info"
      :lado="lado_VM_info"
    />
  </div>
</template>

<script>
import checkbox from "../utils/checkbox";
import shape from "../utils/shape.vue";
import legend_item_child from "../../mixins/legend-item-child";
import { convertirNode } from "../../mixins/_json2olstyle";
import LegendInfo from "./_legend_info.vue";

export default {
  mixins: [legend_item_child],
  components: {
    checkbox,
    shape,
    LegendInfo,
  },
  computed: {
    classShape: function () {
      return this.params.content.shape.startsWith("svg:")
        ? ""
        : this.params.content.shape;
    },
    backgroundImage: function () {
      return this.$parent.$parent.cmpMap.cmpLayers[this.layerId]
        .usarTexturasEnRelleno
        ? `url('${convertirNode("fillPattern", {
            ...this.params.content.texture,
          })
            .fill.getImage()
            .toDataURL()}'`
        : "none";
    },
    usarTexturas: function () {
      return this.$parent.$parent.cmpMap.cmpLayers[this.layerId]
        .usarTexturasEnRelleno;
    },
  },
};
</script>

<style lang="scss" >
.legend-normal-vector {
  display: flex;
  font-weight: 500;
  font-size: 12px;
  line-height: 1.16em;
  .simbologia {
    margin-right: 0.4em;
    max-width: 28px;
    width: 28px;
  }
}
</style>

<style>
.dai-map-shape.simbologia > div {
  margin: 0 auto;
}
</style>