<template>
  <div class="tickets">
    <div class="sorts">
      <button class="sorts-type"
              type="button"
              :class="[(sortBy === 'price') ? 'active' : '']"
              @click="chengeSort('price')"
      >
        Самый дешевый
      </button>
      <button class="sorts-type"
              type="button"
              :class="[(sortBy === 'time') ? 'active' : '']"
              @click="chengeSort('time')"
      >
        Самый быстрый
      </button>
    </div>
    <div class="ticket-load" v-if="load">
      <div class="ticket-block" v-for="ticket in filteredTicket.slice(0, showsTickets)" :key="ticket.segments[0].date">
        <div class="ticket-header">
          <h3 class="ticket-header__price">{{ ticket.price }} ₴</h3>
          <img :src="imgSrc(ticket.carrier)" :alt="ticket.carrier">
        </div>
        <div class="ticket-there" v-for="way in ticket.segments" :key="way.date">
          <div class="row mb-10">
            <div class="col-4">
              <p class="ticket-block__grey">{{ way.origin }} – {{ way.destination }}</p>
              <p class="ticket-block__black">{{ way.date | momentFrom }} - {{ way.date | momentTo(way.duration) }}</p>
            </div>
            <div class="col-4">
              <p class="ticket-block__grey">В пути</p>
              <p class="ticket-block__black">{{ (way.duration / 60).toFixed(0) }}ч {{ way.duration % 60 }}м</p>
            </div>
            <div class="col-4">
              <p class="ticket-block__grey">
                <span>{{ writeStops(way.stops.length) }}</span>
              </p>
              <p class="ticket-block__black">{{ way.stops.join() }}</p>
            </div>
          </div>
        </div>
      </div>
      <button class="more-tickets"
              v-if="filteredTicket.length > showsTickets"
              @click="moreTickets"
              type="button"
      >
        Показать еще
        {{ ((filteredTicket.length - showsTickets) > 4) ? showsTicketsDefault : (filteredTicket.length - showsTickets) }}
        билетов!
      </button>
    </div>
    <Preloader v-else></Preloader>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import Preloader from "@/components/Preloader";

export default {
  name: 'Tickets',
  components: {
    Preloader
  },
  data() {
    return {
      ipCountry: '',
      error: false,
      preloader: true,
      load: false,
      showsTickets: 5,
      showsTicketsDefault: 5,
      allTickets: [],
      filteredTicket: [],
      sortBy: 'price'
    }
  },
  props: [
    'checked'
  ],
  watch: {
    checked: {
      deep: true,
      handler() {
        this.getFilterTickets()
      }

    }
  },
  async created() {
    await this.getId()
  },
  methods: {
    imgSrc(carrier) {
      return `//pics.avs.io/99/36/${carrier}.png`
    },
    writeStops(transfer) {
      if (!transfer) {
        return 'без пересадки'
      } else if (transfer === 1) {
        return `${transfer} пересадка`
      } else {
        return `${transfer} пересадки`
      }
    },
    chengeSort(item) {
      if (item !== this.sortBy) {
        this.sortBy = item
        this.sortTickets()
      }
    },
    moreTickets() {
      if ((this.filteredTicket.length - this.showsTickets) >= this.showsTicketsDefault) {
        this.showsTickets += this.showsTicketsDefault
      } else if ((this.filteredTicket.length - this.showsTickets) < this.showsTicketsDefault) {
        this.showsTickets += (this.filteredTicket.length - this.showsTickets)
      }
    },
    async getId() {
      await axios.get('https://front-test.beta.aviasales.ru/search').then(
          (response) => {
            this.getTickets(response.data.searchId)
          }
      ).catch((error) => {
        console.log(error)
        // do some
      })
    },
    async getTickets(id) {
      await axios.get(`https://front-test.beta.aviasales.ru/tickets?searchId=${id}`).then(
          (response) => {
            response.data.tickets.forEach((e) => {
              this.allTickets.push(e)
            })
            if (!response.data.stop) {
              this.getTickets(id)
            } else {
              this.getFilterTickets()
            }
          }
      ).catch((error) => {
        if (error.response.status === 500) {
          // this.error = true
          this.getTickets(id)
        } else {
          console.log(error)
          // do some
        }
      })
    },
    getFilterTickets() {
      this.load = false
      let trueChecks = Object.keys(this.checked).filter(key => this.checked[key] === true);
      if (trueChecks.length === Object.keys(this.checked).length) {
        this.filteredTicket = Object.assign([], this.allTickets)
      } else {
        let indexOfTrueChecks = [];
        trueChecks.forEach((element) => {
          indexOfTrueChecks.push(Object.keys(this.checked).indexOf(element))
        })
        this.filteredTicket = []
        this.allTickets.forEach((el) => {
          if (indexOfTrueChecks.some(elem => elem === el.segments[0].stops.length)) {
            if (indexOfTrueChecks.some(elem => elem === el.segments[1].stops.length)) {
              this.filteredTicket.push(el)
            }
          }
        })

      }
      this.sortTickets()
      this.showsTickets = this.showsTicketsDefault
      // console.log(this.filteredTicket)
      this.load = true
    },
    sortTickets() {
      if (this.sortBy === 'price') {
        this.filteredTicket.sort(function (a, b) {
          return a.price - b.price
        })
      } else if (this.sortBy === 'time') {
        this.filteredTicket.sort(function (a, b) {
          return (a.segments[0].duration + a.segments[1].duration) - (b.segments[0].duration + b.segments[1].duration)
        })
      }
    }
  },
  filters: {
    momentFrom: function (date) {
      console.log(date)
      return moment.utc(date).format('HH:mm')
    },
    momentTo: function (date, min) {
      return moment.utc(date).add(min, 'm').format('HH:mm')
    }
  }
}
</script>

<style scoped>
.ticket-block {
  margin-bottom: 20px;
  background: #FFFFFF;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 20px;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  height: 36px;
}
.ticket-header img{
  max-height: 100%;
  width: auto;
}
.ticket-header__price {
  margin-top: 5px;
  margin-bottom: 5px;
  font-weight: 600;
  font-size: 24px;
  line-height: 24px;
  color: #2196F3;
}

.ticket-block__grey {
  text-transform: uppercase;
  color: #A0B0B9;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.5px;
}

.ticket-block__black {
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;
}

.more-tickets {
  margin-bottom: 20px;
  background: #2196F3;
  border-radius: 5px;
  text-align: center;
  line-height: 20px;
  padding: 15px;
  text-transform: uppercase;
  color: #FFFFFF;
  letter-spacing: 0.5px;
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;
  cursor: pointer;
  display: block;
  border: none;
  width: 100%;
}

.sorts {
  display: flex;
  margin-bottom: 20px;
}

.sorts-type {
  width: 50%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;
  padding: 15px 10px;
  color: #4A4A4A;
  background: #FFFFFF;
  border: 1px solid #DFE5EC;
  cursor: pointer;
}

.sorts-type.active {
  color: #FFFFFF;
  background: #2196F3;
  border-color: transparent;
  cursor: default;
}

.sorts-type:first-of-type {
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
}

.sorts-type:last-of-type {
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
}

@media (max-width: 780px) {
  .ticket-block {
    padding-left: 12px;
    padding-right: 12px;
  }
}
</style>
