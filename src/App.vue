  <template>
  
    <draw-map> </draw-map>
      
</template>


<script>

export default {
  name: 'App',
    
  components: {
    'draw-map': require('./components/WorldAtlas.vue').default
  }
  
}

</script>

<style>

</style>
