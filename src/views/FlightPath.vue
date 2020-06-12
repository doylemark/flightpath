<template>
  <div class="flight">
    <img @click="github" src="../assets/img/github.png" alt="github-logo" srcset class="logo" />
    <div class="flight__input">
      <SearchDropdown @selectPlace="changeActive" :placeName="placeName" />
    </div>
    <div class="flight__center">
      <div class="details__cont">
        <div class="flight__title">Enjoy that flight ;)</div>
        <button class="flight__button" @click="open">
          Export to SkyVector
          <svg
            class="flight__icon"
            xmlns="http://www.w3.org/2000/svg"
            width="512"
            height="512"
            viewBox="0 0 512 512"
          >
            <path
              d="M384,224V408a40,40,0,0,1-40,40H104a40,40,0,0,1-40-40V168a40,40,0,0,1,40-40H271.48"
              style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"
            />
            <polyline
              points="336 64 448 64 448 176"
              style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"
            />
            <line
              x1="224"
              y1="288"
              x2="440"
              y2="72"
              style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"
            />
          </svg>
        </button>
      </div>
      <div class="map__cont">
        <MglMap :accessToken="token" :mapStyle="style" :center="mapCenter" :zoom="9">
          <MglGeojsonLayer
            sourceId="leftShapeID"
            layerId="leftShapeLayerID"
            :source="shapeSource"
            :layer="shapeLayer"
          />
        </MglMap>
      </div>
    </div>
    <div class="copyright">© Mark Doyle 2020</div>
  </div>
</template>

<script>
import {
  lineArc, destination,
} from '@turf/turf';
import Mapbox from 'mapbox-gl';
import { MglMap, MglGeojsonLayer } from 'vue-mapbox';
import SearchDropdown from '@/components/SearchDropdown.vue';

export default {
  name: 'FlightPath',
  components: { MglMap, MglGeojsonLayer, SearchDropdown },
  props: {
    center: {
      type: String,
      required: true,
      default: '34.597928,36.788289',
    },
    placeName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      style: 'mapbox://styles/markdoyle/ckbcdy7n814w61imbi1xuuo5d',
      token: process.env.VUE_APP_MAP_TOKEN,
      shapeLayer: {
        type: 'line',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#549de3',
          'line-width': 7,
        },
      },
      newPlace: '',
      shapeSource: {},
      setCenter: '',
      setPlaceName: '',
      route: '',
    };
  },
  computed: {
    mapCenter() {
      return this.setCenter.split(',');
    },
  },
  created() {
    this.setCenter = this.center;
    this.setPlaceName = this.placeName;
  },
  mounted() {
    this.mapbox = Mapbox;
    this.drawShape();
  },
  methods: {
    github() {
      window.open('https://github.com/doylemark');
    },
    open() {
      window.open(`https://skyvector.com/?ll=${this.mapCenter.reverse()}&chart=304&zoom=1&fpl=${this.route}`);
    },
    changeActive(place) {
      if (!place) return;
      const center = place.center.toString();
      const placeName = place.place_name;
      this.setCenter = center;
      this.setPlaceName = placeName;
      this.drawShape();
    },
    reverse(coord) {
      return coord.geometry.coordinates.reverse();
    },
    drawShape() {
      const LEFT_CIRC_CENTER = destination(this.mapCenter, 5, 270);
      const LEFT_CIRC_RIGHT_TAN = destination(this.mapCenter, 5, 90);

      const LEFT_CIRC_TOP_RIGHT_ARC = lineArc(LEFT_CIRC_CENTER, 5, 0, 90, { steps: 30 });
      const RIGHT_CIRC_BOTTOM_LEFT_ARC = lineArc(LEFT_CIRC_RIGHT_TAN, 5, 180, 270, { steps: 30 });
      // eslint-disable-next-line max-len
      const RIGHT_CIRCLE_BOTTOM_TO_TOP_ARC = lineArc(LEFT_CIRC_RIGHT_TAN, 5, 270, 180, { steps: 30 });
      const LEFT_CIRC_RIGHT_TO_TOP_ARC = lineArc(LEFT_CIRC_CENTER, 5, 90, 0, { steps: 30 });
      const LEFT_CIRC_TOP_TO_EXIT_ARC = lineArc(LEFT_CIRC_CENTER, 5, 0, 180, { steps: 30 });

      const ROUND_END_CENTER = destination(this.mapCenter, 20, 180);
      const BOX_LEFT_EDGE = destination(ROUND_END_CENTER, 5, 270);

      const BOX_END_ARC = lineArc(ROUND_END_CENTER, 5, 90, 270, { steps: 30 });
      const BOX_RIGHT_EDGE = RIGHT_CIRC_BOTTOM_LEFT_ARC.geometry.coordinates[0];

      this.reverse(RIGHT_CIRC_BOTTOM_LEFT_ARC);
      this.reverse(RIGHT_CIRCLE_BOTTOM_TO_TOP_ARC);
      this.reverse(BOX_END_ARC);

      LEFT_CIRC_TOP_RIGHT_ARC.geometry.coordinates.push(
        ...RIGHT_CIRC_BOTTOM_LEFT_ARC.geometry.coordinates,
        ...RIGHT_CIRCLE_BOTTOM_TO_TOP_ARC.geometry.coordinates,
        ...LEFT_CIRC_RIGHT_TO_TOP_ARC.geometry.coordinates,
        ...LEFT_CIRC_TOP_TO_EXIT_ARC.geometry.coordinates,
        BOX_LEFT_EDGE.geometry.coordinates,
        ...BOX_END_ARC.geometry.coordinates,
        BOX_RIGHT_EDGE,
      );

      this.shapeSource = {
        type: 'geojson',
        data: {
          id: 'shapeID',
          ...LEFT_CIRC_TOP_RIGHT_ARC,
        },
      };
      this.generateRoute(LEFT_CIRC_TOP_RIGHT_ARC.geometry.coordinates);
    },
    generateRoute(coords) {
      let route = '';
      // eslint-disable-next-line no-restricted-syntax
      for (const coord of coords) {
        route += `${coord[1]}, ${coord[0]} `;
      }
      this.route = route;
    },
  },
};
</script>

<style lang="scss" scoped>
.flight {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  @media (max-width: 900px) {
    height: calc(100vh - 2rem);
    padding: 1rem;
    justify-content: start;
  }
}

.flight__center {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  @media (max-width: 900px) {
    flex-direction: column;
  }
}

.details__cont {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 3rem;

  @media (max-width: 500px) {
    padding: 0;
    padding-top: 1rem;
    width: 100%;
  }
}

.flight__button {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.07);
  background-color: transparent;
  cursor: pointer;
  border-radius: 10px;
  width: 100%;
  padding: 1.5rem 2rem;
  font-size: 1.35rem;
  font-family: var(--systemFont);
  font-weight: bolder;
  outline: none;
  font-weight: 300;
  text-align: center;
  transition: all 100 linear;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  @media (max-width: 500px) {
    padding: 1rem;
    margin-bottom: 2rem;
    max-width: auto;
  }
}

.flight__title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.flight__input {
  width: 100%;
  display: flex;
  justify-content: center;
  align-self: center;
  margin-bottom: 2rem;

  @media (max-width: 900px) {
    margin-top: 6rem;
    margin-bottom: 1rem;
  }
}

.flight__icon {
  height: 1.5rem;
  width: 1.5rem;
  margin-left: 0.5rem;

  polyline,
  line,
  path {
    stroke: black;
  }
}

.map__cont,
.mgl-map-wrapper {
  height: 50vh;
  width: 40vw;

  @media (max-width: 900px) {
    width: 100%;
  }
}
</style>

<style lang="scss">
.mapboxgl-canvas {
  border-radius: 10px;
}
</style>
