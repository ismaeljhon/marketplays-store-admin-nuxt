<template>
  <form enctype="multipart/form-data" method="post" @submit.prevent>
    <VueFileAgent
      ref="vueFileAgent"
      :theme="'grid'"
      :multiple="true"
      :deletable="true"
      :meta="true"
      :accept="'image/*,.zip'"
      :maxSize="'10MB'"
      :maxFiles="14"
      :helpText="'Choose images or zip files'"
      :errorText="{
        type: 'Invalid file type. Only images or zip Allowed',
        size: 'Files should not exceed 10MB in size',
      }"
      @select="filesSelected($event)"
      @beforedelete="onBeforeDelete($event)"
      @delete="fileDeleted($event)"
      v-model="fileRecords"
      name="files"
    ></VueFileAgent>
    <button :disabled="!fileRecordsForUpload.length" @click="save()">
      Upload {{ fileRecordsForUpload.length }} files
    </button>
  </form>
</template>
<script>
import axios from '@nuxtjs/axios'
export default {
  data: function () {
    return {
      fileRecords: [],
      uploadUrl: 'http://localhost:5001/uploadFiles',
      uploadHeaders: {},
      fileRecordsForUpload: [], // maintain an upload queue
    }
  },
  methods: {
    uploadFiles: function () {
      // Using the default uploader. You may use another uploader instead.
      var formData = new FormData()

      this.$refs.vueFileAgent.upload(
        this.uploadUrl,
        this.uploadHeaders,
        this.fileRecordsForUpload,
        function createFormData(fileData) {
          formData.append('files', fileData.file)
          return formData
        }
      )
      this.fileRecordsForUpload = []
    },
    deleteUploadedFile: function (fileRecord) {
      // Using the default uploader. You may use another uploader instead.
      this.$refs.vueFileAgent.deleteUpload(
        this.uploadUrl,
        this.uploadHeaders,
        fileRecord
      )
    },
    filesSelected: function (fileRecordsNewlySelected) {
      var validFileRecords = fileRecordsNewlySelected.filter(
        (fileRecord) => !fileRecord.error
      )
      this.fileRecordsForUpload = this.fileRecordsForUpload.concat(
        validFileRecords
      )
    },
    onBeforeDelete: function (fileRecord) {
      var i = this.fileRecordsForUpload.indexOf(fileRecord)
      if (i !== -1) {
        // queued file, not yet uploaded. Just remove from the arrays
        this.fileRecordsForUpload.splice(i, 1)
        var k = this.fileRecords.indexOf(fileRecord)
        if (k !== -1) this.fileRecords.splice(k, 1)
      } else {
        if (confirm('Are you sure you want to delete?')) {
          this.$refs.vueFileAgent.deleteFileRecord(fileRecord) // will trigger 'delete' event
        }
      }
    },
    fileDeleted: function (fileRecord) {
      var i = this.fileRecordsForUpload.indexOf(fileRecord)
      if (i !== -1) {
        this.fileRecordsForUpload.splice(i, 1)
      } else {
        this.deleteUploadedFile(fileRecord)
      }
    },
    async save({ $axios }) {
      // upload data to the server
      const formData = new FormData()
      if (!this.fileRecordsForUpload.length) return
      for (var i = 0; i < this.fileRecordsForUpload.length; i++) {
        let file = this.fileRecordsForUpload[i]
        // Here we create unique key 'files[i]' in our response dict
        formData.append('files[' + i + ']', file)
      }

      const result = await $axios
        .$post(this.uploadUrl, formData)
        .then((response) => {
          console.log(response)
          this.fileRecordsForUpload = []
        })
        .catch((err) => {
          console.log(err.response)
          this.fileRecordsForUpload = []
        })

      console.log(result)
      return result
    },
  },
}
</script>

