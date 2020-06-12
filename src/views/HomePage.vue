<template>
  <div class="home center">
    <img @click="github" src="../assets/img/github.png" alt="github-logo" srcset class="logo" />
    <div class="home__container center col">
      <div>
        <div class="home__title">flightpath</div>
        <div class="home__subtitle">
          fly an inappropriate, GPS
          guided holding pattern over your mates' house?
        </div>
      </div>
      <SearchDropdown @selectPlace="openPlace" />
    </div>
    <div class="copyright">© Mark Doyle 2020</div>
  </div>
</template>

<script>
import SearchDropdown from '@/components/SearchDropdown.vue';

export default {
  components: { SearchDropdown },
  methods: {
    openPlace(place) {
      const center = place.center.toString();
      const placeName = place.place_name;
      this.$router.push({ name: 'flightpath', params: { center, placeName } });
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  width: 100vw;
  height: 100vh;
  padding: 2rem;
}
.home__container {
  text-align: center;
  height: 100%;
}
.home__title {
  font-size: 1.75rem;
  font-weight: 800;
}
.home__subtitle {
  color: var(--light);
  font-size: 1.35rem;
  line-height: 1;
  margin: 1rem 0;

  @media (max-width: 900px) {
    font-size: 1rem;
  }
}
.input__cont {
  width: 500px;
  position: relative;
  max-width: 90vw;
}
</style>

<style lang="scss">
.copyright {
  color: var(--light);
  position: absolute;
  bottom: 2rem;
  font-family: var(--codeFont);
  font-weight: 600;
  font-size: 1.25rem;
}

.logo {
  position: absolute;
  height: 3rem;
  top: 2rem;
  right: 2rem;
  cursor: pointer;
}
</style>
