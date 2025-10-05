<script>
  import Header from "./components/base/Header/index.svelte";
</script>

<svelte:head>
  <title>DRMDLR</title>
</svelte:head>

<main>
  <Header />
  <section>
    <div class="title-primary">DRUM</div>
    <div class="red-square" />
  </section>
</main>

<style lang="scss">
  :global(body) {
    min-height: 100vh;
    box-sizing: border-box;
    overflow: hidden;
    background-color: var(--primary-color);
  }
  :global(main) {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 0 auto;
  }
  @import "./styles/variables.scss";
  section {
    display: flex;
    justify-content: start;
    align-items: flex-start;
    // margin: 0 auto;
    height: 100vh;
    padding: 5rem 0;
  }

  .title-primary {
    font-weight: 800;
    color: var(--accent-color);
    // grid-area: 3/4/2/4;
    // grid-row: 2/6;
    // grid-column: 2/7;
    font-size: 20rem;
  }

  // .title-secondary {

  // }

  .red-square {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: stretch;
    &::before {
      z-index: 2;
      position: absolute;
      content: " ";
      width: 64rem;
      height: 60rem;
      background: url(drums.png) no-repeat center;
      background-size: contain;
      top: 1.6rem;
      /* xl (>=1200) */
      @media (min-width: $xl) and (max-width: $xl-max) {
        right: -32rem;
        width: 60rem;
        height: 58rem;
      }
      @media (min-width: $xxl) {
        right: -30rem;
        width: 50rem;
        height: 45rem;
      }
    }
    &::after {
      content: "DEALER";
      font-weight: 700;
      font-size: 14rem;
      color: var(--primary-color);
      transform: rotate(90deg);
      position: absolute;
      left: 0;
      top: 0;
      background: var(--accent-color);
      width: 62rem;
      height: 54rem;
      /* xl (>=1200) */
      @media (min-width: $xl) and (max-width: $xl-max) {
        margin-left: -6.8rem;
        margin-top: 6.1rem;
        width: 52rem;
        height: 42rem;
        font-size: 12rem;
      }
      @media (min-width: $xxl) {
        margin-left: -5.8rem;
        margin-top: 5.1rem;
        font-size: 11rem;
        width: 48rem;
        height: 40rem;
      }
    }
  }
</style>
