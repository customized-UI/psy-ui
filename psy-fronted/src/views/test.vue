
<script setup lang="ts">

import { ref, onMounted, toRaw } from 'vue'
import { Quill, QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
const myquill = ref<any>(null)
const showTooltip = ref(false)
const tooltipPosition = ref({ mt: 0, x: 0, y: 0 })
const selectedText = ref('')
let quill =ref<any>(null)


const handleSelection = () => {
  const selection = quill.getSelection()
      if (selection && selection.length > 0) {
        const bounds = quill.getBounds(selection.index, selection.length)
        quill.root.addEventListener('scroll', function () {
          tooltipPosition.value.mt = -quill.root.scrollTop;
        });
        tooltipPosition.value.mt = -quill.root.scrollTop;
        tooltipPosition.value.y = bounds.bottom + quill.root.scrollTop
        tooltipPosition.value.x = bounds.left
        selectedText.value = quill.getText(selection.index, selection.length)
        showTooltip.value = true
      } else {
        showTooltip.value = false
      }
    }
onMounted(async () => {
  
    // quill = await new Quill('#myquill', {
    //     theme: 'snow'
    // })
    // await quill.on('selection-change', handleSelection)
})

</script>

<template>
    <!-- <div id="myquill" ref="myquill">
    </div>
    <div v-if="showTooltip" class="tooltip" :style="{  marginTop: `${tooltipPosition.mt}px`, top: `${tooltipPosition.y + 45}` + 'px', left: tooltipPosition.x + 'px' }">
      <div>
        <button>Search</button>
      </div>
    </div> -->
</template>

<style>
.ql-editor {
    position: relative;
}
.tooltip {
  position: absolute;
  width: 100px;
  padding: 10px;
  background-color: #f2f2f2;
  border: 1px solid #ccc;
}

.tooltip button {
  margin-right: 5px;
}
</style>