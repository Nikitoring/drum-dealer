<script>
  import { Router } from 'svelte-routing';
  import Header from './components/base/Header/index.svelte';

  export let url = '';
</script>

<svelte:head>
  <title>DRMDLR</title>
</svelte:head>

<Router {url}>
  <Header />
  <main>
    <section>
      <div class="title-primary">
        DRUMS
        <p class="title-secondary">Saint-Petersburg</p>
        <p class="title-secondary">EST. 2021</p>
      </div>
      <div class="square" />
    </section>
  </main>
</Router>

<style lang="scss">
  @import './styles/main.scss';
</style>
