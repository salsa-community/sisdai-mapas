<template>
    <div class="dai-map-shape" >
        <div  v-if="shapeType!=='image'" 
        class="shape"
        :class="shapeType"
        :style="{
            '--shape-bg-color': backgroundColor,
            '--shape-stroke-color': strokeColor,
            'width':`${size[0]}${sizeUnits}`,
            'height':`${size[1]}${sizeUnits}`,
            'backgroundColor':'var(--shape-bg-color)',
            'backgroundImage':backgroundImage,
            'borderWidth':`${strokeWidth}px`,
            'borderColor':'var(--shape-stroke-color)',
            
            }" ></div>
        <div v-if="shapeType==='image'"
        >
            <img class="imagen-leyenda" :src="imageOptions.src" alt="..">
        </div>
    </div>
    
</template>


<script>
export default {
    props:{
        shapeType:{
            default:"circle",
            type:String,
            required:true,
            validator:function(value){
                return ['circle', 'square', 'triangle','rounded-square',"image","line"].indexOf(value) !== -1
            }
        },
        size:{
            default:function(){
                return [10,10]
            },
            type:Array
        },
        sizeUnits:{
            default:"px",
            type:String
        },
        backgroundColor:{
            default:"black",
            type:String
        },
        imageOptions:{
            default:function(){
                return {}
            },
            type:Object
        },
        strokeColor:{
            default:'white',
            type:String
        },
        strokeWidth:{
            default:1,
            type:Number
        },
        backgroundImage:{
            default:'none',
            type:String
        }
    }
}
</script>

<style lang="scss" scoped>
.dai-map-shape{
    display: inline-block;
    .circle,.square,.triangle,.rounded-square{
        border-style: solid;
    }
    .circle{
        border-radius: 50%;
    }

    .rounded-square{
        border-radius: 20%;
    }
    .line{
        border-style: solid none none none;
        transform: translateY(50%);
    }

    .imagen-leyenda{
        max-width: 100%;
        max-height: 28px;
        object-fit: cover;
    }
}
</style>
