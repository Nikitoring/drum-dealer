<script>
  import { Router, Route } from 'svelte-routing';
  import Header from './components/base/Header/index.svelte';
  import MainPage from './components/MainPage.svelte';
  import Kovry from './components/Kovry.svelte';
</script>

<svelte:head>
  <title>DRMDLR</title>
</svelte:head>

<Router>
  <div>
    <Header />
  </div>
  <main>
    <Route path="/" component={MainPage} />
    <Route path="/kovry" component={Kovry} />
    <!-- <Route path="/blog" component={Blog} /> -->
    <!-- <Route path="/about" component={About} /> -->
  </main>
</Router>
