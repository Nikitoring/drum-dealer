<script lang="ts">
  import { onMount } from 'svelte';
  import { Link } from 'svelte-routing';

  let isMenuShow = false;
  let src = 'menu-logo.svg';
  function setMenu() {
    isMenuShow = !isMenuShow;
    if (isMenuShow) {
      src = 'menu-logo-open.svg';
      return;
    }
    src = 'menu-logo.svg';
  }

  function closeMenu() {
    isMenuShow = false;
    src = 'menu-logo.svg';
  }
  let current_url = '';
  let path = '';
  onMount(() => (current_url = window.location.href));
</script>

<header>
  <div class="logo-wrapper">
    <button class="menu-logo" on:click={setMenu}>
      <img {src} alt="menu" width="50" height="70" />
    </button>
  </div>

  <div class={isMenuShow ? 'modal-shadow-on modal-shadow' : 'modal-shadow'}>
    <div class={isMenuShow ? 'modal-drawer modal-drawer-on' : 'modal-drawer'}>
      <nav class={isMenuShow ? 'nav-show' : ''}>
        <ul>
          {#if path !== '/'}
            <li class="to-home">
              <Link on:click={closeMenu} to="/">DRMDLR</Link>
            </li>
          {/if}
          <li class="link-to" class:active={path === '/catalog'}>
            <Link on:click={closeMenu} to="/catalog">Каталог</Link>
          </li>
          <li class="link-to" class:active={path === '/covry'}>
            <Link on:click={closeMenu} to="/about">"Ковры"</Link>
          </li>
          <li class="link-to" class:active={path === '/contacts'}>
            <Link class="primary-color" on:click={closeMenu} to="/contacts"
              >Контакты</Link
            >
          </li>
        </ul>
      </nav>
    </div>
  </div>
</header>

<style lang="scss">
  @import './index.scss';
</style>
