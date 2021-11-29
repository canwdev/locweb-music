<template>
  <div class="file-dropzone">
    <div class="border-dashed">
      <span class="material-icons">upload_file</span>
      Drop files here
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileDropzone'
}
</script>

<style lang="scss" scoped>
.file-dropzone {
  pointer-events: none;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  box-sizing: border-box;
  z-index: 10;

  .border-dashed {
    height: 100%;
    width: 100%;
    color: $primary;
    border: 3px dashed;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-size: 18px;
    box-sizing: border-box;
    flex-direction: column;

    .material-icons {
      font-size: 50px;
      margin-bottom: 15px;
    }
  }
}
</style>
