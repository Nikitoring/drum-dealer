<script lang="ts">
  import { fade } from 'svelte/transition';
  // Заменяем устаревший импорт на новый
  import { myState } from '../../../stores/main';
  import { browser } from '$app/environment'; // Обратите внимание: это также могло измениться на '$app/environment'

  // Используем $derived для реактивности вместо реактивных объявлений ($:)
  $myState.path = page.url.pathname;

  // Логика для обновления класса body
  $effect(() => {
    if (browser) {
      document.body.classList.toggle('secondary', $myState.path === '/catalog');
    }
  });

  let isMenuShow = false;

  function setMenu() {
    isMenuShow = !isMenuShow;
  }

  function closeMenu() {
    isMenuShow = false;
  }
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
          <!-- {#if path !== '/'}
						<li class="to-home" transition:fade|global>
							<a on:click={closeMenu} sveltekit:prefetch href="/"> DRMDLR </a>
						</li>
					{/if} -->
          <li class="link-to" class:active={path === '/catalog'}>
            <a on:click={closeMenu} sveltekit:prefetch href="/catalog"
              >Каталог</a
            >
          </li>
          <li class="link-to" class:active={path === '/about'}>
            <a on:click={closeMenu} sveltekit:prefetch href="/about">Обо мне</a>
          </li>
          <li class="link-to" class:active={path === '/contacts'}>
            <a on:click={closeMenu} sveltekit:prefetch href="/contacts"
              >Контакты</a
            >
          </li>
        </ul>
      </nav>
    </div>
  </div>
  <div class="theme-state">
    <a sveltekit:prefetch href="/blog" class:active={path === '/blog'}>Блог</a>
  </div>
</header>

<style lang="scss">
  @import './index.scss';
</style>
