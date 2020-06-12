<template>
  <div class="input__cont">
    <input
      placeholder="Bray Town"
      type="text"
      v-model="searchInput"
      @input="search()"
      @focus="search()"
      @keydown.enter="selectPlace()"
      @keydown.up.prevent="selectUp()"
      @keydown.down.prevent="selectDown()"
      v-click-outside="blur"
      class="home__input"
    />
    <div class="home__dropdown">
      <div
        class="home__item center"
        :class="{ 'home__item-active': index === activePlaceIndex}"
        v-for="(place, index) in places"
        @click="selectPlace()"
        @mouseover="activePlaceIndex = index"
        @mouseout="activePlaceIndex = -1"
        :key="place.id"
      >{{place.place_name}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  props: {
    placeName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      activePlaceIndex: 0,
      searchInput: '',
      places: [],
      geocoderToken: process.env.VUE_APP_MAP_TOKEN,
    };
  },
  mounted() {
    if (this.placeName) this.searchInput = this.placeName;
  },
  methods: {
    async search() {
      const searchStr = this.searchInput.split(' ').join('%20');
      if (searchStr.length === 0) {
        this.places = [];
        return;
      }
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchStr}.json?access_token=${this.geocoderToken}`);
      const data = await response.json();
      this.places = data.features;
    },
    selectPlace() {
      this.$emit('selectPlace', this.places[this.activePlaceIndex]);
      this.blur();
    },
    selectUp() {
      if (this.activePlaceIndex === 0) return;
      this.activePlaceIndex -= 1;
    },
    selectDown() {
      if (this.activePlaceIndex === 4) return;
      this.activePlaceIndex += 1;
    },
    blur() {
      this.places = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.input__cont {
  max-width: 500px;
  position: relative;
  width: 100%;
}

.home__input {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 10px;
  width: 100%;
  padding: 1.5rem 2rem;
  font-size: 1.35rem;
  font-family: var(--codeFont);
  outline: none;
  font-weight: 300;
  text-align: center;
  transition: all 100 linear;
}

.home__dropdown {
  width: 100%;
  position: absolute;
  z-index: 3;
  margin-top: -10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  background-color: transparent;
  border-radius: 0px 0px 10px 10px;
}

.home__item {
  font-family: var(--codeFont);
  background-color: white;
  padding: 1rem 0.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.07);
  cursor: pointer;
  font-size: 0.85rem;
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-bottom: none;
  vertical-align: center;

  &:first-child {
    border-top: none;
  }
  &:last-child {
    border-radius: 0px 0px 10px 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  }
}
.home__item-active {
  background-color: #d7e8f8;
}
</style>
