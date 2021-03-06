<template>
  <div class="btn-group">
    <button class="btn btn-default dropdown-toggle" ref="dropdownBtn">
      <i class="fa" :class="[usingBak && 'text-info', processingCls || 'fa-cog']"></i>
      <span class="caret"></span>
    </button>
    <div class="dropdown-menu p-10 clearfix" :style="drpMenuStyle">
      <div class="-col-group-container">
        <column-group v-for="(group, idx) in colGroups" :key="idx" ref="colGroups" :col-group="group" />
      </div>
      <div class="m-10 clearfix">
        <div class="btn-group btn-group-sm pull-right">
          <button class="btn btn-default" @click="apply()">
            {{ $i18n('Apply') }}
          </button>
          <template v-if="supportBackup">
            <button data-toggle="dropdown" class="btn btn-default dropdown-toggle box-shadow-none">
              <span class="caret"></span>
            </button>
            <ul class="dropdown-menu">
              <li @click="apply(true)">
                <a href="javascript:;">
                  <i class="fa fa-floppy-o"></i>&nbsp;
                  {{ $i18n('Apply and backup settings to local') }}
                </a>
              </li>
              <li v-if="usingBak" @click="rmBackup()">
                <a href="javascript:;">
                  <i class="fa fa-trash-o text-danger"></i>&nbsp;
                  {{ $i18n('Clear local settings backup and restore') }}
                </a>
              </li>
            </ul>
          </template>
        </div>
      </div>
      <small v-if="usingBak" class="pull-left text-muted m-t--8">
        ( {{ $i18n('Using local settings') }} )
      </small>
    </div>
  </div>
</template>
<script>
import ColumnGroup from './ColumnGroup.vue'
import replaceWith from 'replace-with'
const LS = localStorage
const parseStr = JSON.parse
const stringify = JSON.stringify
const rmFromLS = k => LS.removeItem(k)
const saveToLS = (k, v) => LS.setItem(k, stringify(v))
const getFromLS = k => { try { return parseStr(LS.getItem(k)) } catch (e) { rmFromLS(k) } }
const hash = s => '' + s.split('').reduce((a, b) => (a = (a << 5) - a + b.charCodeAt(0), a & a), 0)
// the hash algorithm above refers to http://stackoverflow.com/a/15710692/5172890

export default {
  components: { ColumnGroup },
  props: {
    colGroups: { type: Array, required: true },
    supportBackup: { type: Boolean, required: true }
  },
  created () {
    const { localKey: key } = this
    if (!key) return // no need to support backup

    const backup = getFromLS(key)
    if (!backup) return
    replaceWith(this.colGroups, backup)
    this.usingBak = true
  },
  data () {
    const origSettings = stringify(this.colGroups)
    return {
      origSettings,
      usingBak: false,
      processingCls: '',
      localKey: this.supportBackup && hash(origSettings) // key for local backup
    }
  },
  computed: {
    drpMenuStyle () {
      const w = this.colGroups.length * 150
      return {
        width: `${w + 25}px`,
        left: `-${w - 25}px`
      }
    }
  },
  mounted () {
    // control dropdown manually (refers to http://jsfiddle.net/rj3k550m/3)
    const $el = $(this.$el)
    $(this.$refs.dropdownBtn).on('click', this.toggle)
    $(document).on('click', e => {
      $(e.target).closest($el).length || $el.removeClass('open')
    })
  },
  methods: {
    apply (alsoBackup) {
      this.toggle()
      this.$refs.colGroups.forEach(colGroup => colGroup.apply())
      alsoBackup && this.$nextTick(this.backup)
    },
    backup () {
      saveToLS(this.localKey, this.colGroups)
      this.showProcessing()
      this.usingBak = true
    },
    rmBackup () {
      rmFromLS(this.localKey)
      this.showProcessing()
      this.usingBak = false
      
      replaceWith(this.colGroups, parseStr(this.origSettings)) // restore
    },
    toggle () {
      $(this.$el).toggleClass('open')
    },
    showProcessing () {
      ['fa-spinner fa-pulse', 'fa-check', ''].forEach((cls, idx) => {
        setTimeout(() => this.processingCls = cls, idx * 1000)
      })
    }
  }
}
</script>
<style>
.-col-group-container {
  border-bottom: 1px solid #ddd;
}
.p-10 {
  padding: 10px 10px 0 10px;
}
.m-10 {
  margin: 10px;
}
.m-t--8 {
  margin-top: -8px;
}
.box-shadow-none {
  box-shadow: none !important;
}
</style>
