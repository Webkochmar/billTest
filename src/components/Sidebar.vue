<template>
  <aside>
    <div class="transfer-filter filter">
      <h3>Количество пересадок</h3>
      <div class="filter-checked">
        <label>
          <input
              type="checkbox"
              v-model="allOptionToggle"
              @change="allCheckbox"
          >
          <span></span>
          <p>Все</p>
        </label>
      </div>
      <div :key="updFilter">
      <div class="filter-checked">
        <label>
          <input type="checkbox"
                 v-model="transferOption.noTransfer"
                 @change="checkbox"
          >
          <span></span>
          <p>Без пересадок</p>
        </label>
      </div>
      <div class="filter-checked">
        <label>
          <input type="checkbox"
                 v-model="transferOption.oneTransfer"
                 @change="checkbox"
          >
          <span></span>
          <p>1 пересадка</p>
        </label>
      </div>
      <div class="filter-checked">
        <label>
          <input type="checkbox"
                 v-model="transferOption.twoTransfer"
                 @change="checkbox"
          >
          <span></span>
          <p>2 пересадки</p>
        </label>
      </div>
      <div class="filter-checked">
        <label>
          <input type="checkbox"
                 v-model="transferOption.threeTransfer"
                 @change="checkbox"

          >
          <span></span>
          <p>3 пересадки</p>
        </label>
      </div>
      </div>
      {{transferOption}}
    </div>
  </aside>
</template>

<script>
export default {
  name: "Sidebar",
  data () {
    return {
      allOptionToggle: false,
      updFilter: 0,
      transferOption: {
        noTransfer: true,
        oneTransfer: true,
        twoTransfer: false,
        threeTransfer: false,
      }
    }
  },
  methods: {
    chengeUrl () {
      this.$router.push( {query : this.transferOption} )
    },
    checkbox () {
      if (Object.keys(this.transferOption).every((k) => !this.transferOption[k])) {
        Object.keys(this.transferOption).forEach((key) => {
          this.transferOption[key] = JSON.parse(this.$route.query[key])
        })
        this.updFilter += 1
      } else {
        if (Object.keys(this.transferOption).every((k) => this.transferOption[k])) {
          this.allOptionToggle = true
        } else {
          this.allOptionToggle = false
        }
        this.chengeUrl ()
      }
    },
    allCheckbox () {
      if (this.allOptionToggle) {
        Object.keys(this.transferOption).forEach((key) => {
          this.transferOption[key] = true
        })
        this.chengeUrl ()
      } else {
        this.transferOption.noTransfer = true
        this.transferOption.oneTransfer = true
        this.transferOption.twoTransfer = false
        this.transferOption.threeTransfer = false
        this.chengeUrl ()
      }
    }
  },
  created() {
    this.chengeUrl ()
  }
}

</script>

<style scoped>
.filter{
  background: #FFFFFF;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding-top: 20px;
  padding-bottom: 10px;
  margin-bottom: 15px;
}
.filter-checked:hover{
  background: #F1FCFF;
}
.filter-checked label{
  display: flex;
  cursor: pointer;
  padding: 10px 10px 10px 20px;
}
.filter-checked label span{
  border: 1px solid #9ABBCE;
  box-sizing: border-box;
  border-radius: 2px;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  position: relative;
}
.filter-checked label input:checked ~ span{
  border: 1px solid #2196F3;
}
.filter-checked label input:checked ~ span::before{
  content: '';
  position: absolute;
  transform: rotate(-45deg);
  width: 10px;
  height: 6px;
  top: 4px;
  left: 3px;
  border-bottom: 2px solid #2196F3;
  border-left: 2px solid #2196F3;
}
.filter-checked label p{
  line-height: 20px;
}
.filter h3{
  margin-top: 0;
  margin-bottom: 5px;
  padding-left: 20px;
  padding-right: 10px;
}
.filter-checked input{
  display: none;
}
.filter-checked span {
  display: inline-block;
  position: relative;
}
</style>
