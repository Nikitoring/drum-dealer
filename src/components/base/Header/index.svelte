<script lang="ts">
  import { onMount } from 'svelte';
  import { Link } from 'svelte-routing';

  let isMenuShow = false;

  function setMenu() {
    isMenuShow = !isMenuShow;
  }

  function closeMenu() {
    isMenuShow = false;
  }
  let current_url = '';
  let path = '';
  onMount(() => (current_url = window.location.href));
</script>

<header>
  <div class="logo-wrapper">
    <button class="menu-logo" on:click={setMenu}>
      <svg
        width="76"
        height="76"
        viewBox="0 0 76 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="38"
          cy="38"
          r="36"
          stroke={isMenuShow ? '#EFE5D4' : '#F07D10'}
          stroke-width="4"
        />
        <path
          class={isMenuShow ? 'active left-stick' : 'left-stick'}
          d="M31.4972 4.3139H32.4566L33.296 74.5866H30.418L31.4972 4.3139Z"
          fill={isMenuShow ? '#EFE5D4' : '#F07D10'}
        />

        <ellipse
          cx="31.9769"
          cy="2.93481"
          rx="0.959354"
          ry="1.73883"
          fill={isMenuShow ? '#EFE5D4' : '#F07D10'}
        />
        <path
          class={isMenuShow ? 'active right-stick' : 'right-stick'}
          d="M43.4156 4.3139H42.4562L41.6168 74.5866H44.4949L43.4156 4.3139Z"
          fill={isMenuShow ? '#EFE5D4' : '#F07D10'}
        />
        <ellipse
          rx="0.959354"
          ry="1.73883"
          transform="matrix(-1 0 0 1 42.9359 2.93481)"
          fill={isMenuShow ? '#EFE5D4' : '#F07D10'}
        />
      </svg>
    </button>
  </div>

  <div class={isMenuShow ? 'modal-shadow-on modal-shadow' : 'modal-shadow'}>
    <div class={isMenuShow ? 'modal-drawer modal-drawer-on' : 'modal-drawer'}>
      <nav class={isMenuShow ? 'nav-show' : ''}>
        <ul>
          {#if path !== '/'}
            <li class="to-home" transition:fade|global>
              <Link on:click={closeMenu} to="/">DRMDLR</Link>
            </li>
          {/if}
          <li class="link-to" class:active={path === '/catalog'}>
            <Link on:click={closeMenu} to="/catalog">Каталог</Link>
          </li>
          <li class="link-to" class:active={path === '/about'}>
            <Link on:click={closeMenu} to="/about">Обо мне</Link>
          </li>
          <li class="link-to" class:active={path === '/contacts'}>
            <Link on:click={closeMenu} to="/contacts">Контакты</Link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
  <div class="theme-state">
    <Link to="/blog">Блог</Link>
  </div>
</header>

<style lang="scss">
  @import './index.scss';
</style>
