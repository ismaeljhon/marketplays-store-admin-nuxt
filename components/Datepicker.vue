<template>
  <v-row>
    <v-col :cols="enableTimepicker ? dateCols : '12'" class="pb-0">
      <v-menu
        v-model="datePickerMenu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            prepend-icon="mdi-calendar"
            readonly
            :error-messages="errors"
            :value="computedDateFormattedMomentjs"
            class="pt-0"
            v-on="on"
          >
            <template slot="label">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="dateLabel"></span>
            </template>
          </v-text-field>
        </template>
        <v-date-picker
          v-model="date"
          :min="min"
          reactive
          no-title
          :error-messages="errors"
          @input="
            datePickerMenu = false
            emitValues()
          "
        ></v-date-picker>
      </v-menu>
    </v-col>
    <v-col v-if="enableTimepicker" :cols="timeCols" class="pb-0">
      <v-menu
        ref="menu"
        v-model="timepickerMenu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            label="Preferred Time"
            prepend-icon="mdi-clock-outline"
            readonly
            class="pt-0"
            :value="computedTimeMomentjs"
            hide-details
            v-on="on"
          >
          </v-text-field>
        </template>
        <v-time-picker
          v-if="timepickerMenu"
          v-model="time"
          full-width
          @click:minute="$refs.menu.save(time)"
          @input="emitValues"
        ></v-time-picker>
      </v-menu>
    </v-col>
  </v-row>
</template>
<script>
import moment from 'moment-timezone'

export default {
  name: 'Datepicker',
  props: {
    dateLabel: {
      type: String,
      default: 'Date',
    },
    errors: {
      type: [String, Array, Object],
      default: '',
    },
    defaultValue: {
      type: String,
      default: null,
    },
    defaultFormat: {
      type: String,
      default: 'dddd MMMM DD, YYYY',
    },
    enableTimepicker: {
      type: Boolean,
      default: true,
    },
    dateCols: {
      type: [Number, String],
      default: 6,
    },
    timeCols: {
      type: [Number, String],
      default: 6,
    },
    min: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      datePickerMenu: false,
      timepickerMenu: false,
      date: null,
      time: null,
    }
  },
  computed: {
    computedDateFormattedMomentjs() {
      return this.date || this.defaultValue
        ? moment(this.defaultValue || this.date).format(this.defaultFormat)
        : ''
    },
    computedTimeMomentjs() {
      return this.time ? moment(this.time, 'hh:mm').format('hh:mm a') : ''
    },
  },
  watch: {
    defaultValue(value) {
      if (!value) {
        this.date = null
        this.time = null
      }
      this.date = moment(value, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD')

      if (this.enableTimepicker)
        this.time = moment(value, 'YYYY-MM-DD HH:mm').format('HH:mm')
    },
  },
  methods: {
    emitValues() {
      let datetime = this.date

      if (this.time) datetime += ' ' + this.time

      this.$emit('input', datetime)
    },
  },
}
</script>
