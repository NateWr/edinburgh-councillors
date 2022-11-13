<template>
    <div class="relative landscape:mb-8 landscape:last:mb-0">
        <h3 class="
            ec-ward-name
            mb-4
            flex
            justify-between
            items-center
            bg-white
            font-semibold
            text-sm
            landscape:w-full
        ">
            <span class="bg-white whitespace-nowrap xl:text-lg">
                {{ name }}
            </span>
            <span class="text-xs font-normal text-gray-500 tracking-wide whitespace-nowrap xl:text-base">WARD {{ number }}</span>
        </h3>
        <ul class="flex m-0 p-0 list-none landscape:block">
            <li
                v-for="councillor in councillors"
                :key="councillor.name"
                class="ec-councillor grid rounded mr-4 last:mr-0 overflow-hidden landscape:mr-0 landscape:mb-4"
            >
                <img class="ec-councillor-image" :src="councillor.image" />
                <div class="ec-councillor-details">
                    <h3 class="font-bold mb-1 leading-4 xl:text-xl xl:leading-5 xl:mb-0">
                        {{ councillor.name }}
                    </h3>
                    <div class="text-xs xl:text-base xl:leading-5">
                        {{ councillor.party }}
                    </div>
                    <div class="ec-councillor-actions">
                        <button
                            class="ec-councillor-action"
                            :aria-label="'Call ' + councillor.name"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/>
                            </svg>
                        </button>
                        <button
                            class="ec-councillor-action ec-councillor-action-email"
                            :aria-label="'Email ' + councillor.name"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/>
                            </svg>
                        </button>
                        <a
                            :href="councillor.url"
                            class="ec-councillor-action"
                            target="_blank"
                            rel="noreferrer noopener"
                            :aria-label="'Visit website for ' + councillor.name"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path d="M288 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h50.7L169.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L384 141.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H288zM80 64C35.8 64 0 99.8 0 144V400c0 44.2 35.8 80 80 80H336c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v80c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16h80c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        name: String,
        number: Number,
        councillors: Array
    }
}
</script>

<style lang="postcss">
@import '../assets/css/variables.css';

.ec-ward-name {
    position: sticky;
    display: flex;
    left: 0;
    width: calc(100vw - 2rem);
    border-bottom: 2px solid var(--color-link-light);
}

.ec-councillor {
    grid-template-columns: 8rem 12rem;
    min-width: 20rem;
    box-shadow: 0 2px 5px #5f050022;
    outline: 1px solid #ff50461c;
}

.ec-councillor-image {
    width: 8rem;
    height: 8rem;
}

.ec-councillor-details {
    position: relative;
    padding: 0.5rem 1rem;
}

.ec-councillor-actions {
    position: absolute;
    display: grid;
    grid-template-columns: 33% 34% 33%;
    bottom: 0.5rem;
    left: 1rem;
    right: 0.5rem;
    background: var(--color-link);
    border-radius: var(--border-radius);
    overflow: hidden;
}

.ec-councillor-action {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.85rem;
    height: 2rem;
    color: var(--color-text-on-bg-action);
    background: transparent;
    border: none;

    svg {
        width: 0.75rem;
        height: auto;

        path {
            fill: var(--color-text-on-bg-action);
        }
    }

    + .ec-councillor-action {
        border-left: 1px solid #db3228;
    }

    &:hover {
        background: #ff554b;
    }

    &:focus {
        outline: 1px solid var(--color-text-on-bg-action);
        outline-offset: -2px;
    }

    &:first-child {
        border-top-left-radius: var(--border-radius);
        border-bottom-left-radius: var(--border-radius);
    }

    &:last-child {
        border-top-right-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
    }
}

.ec-councillor-action-email svg {
    width: 0.85rem;
}

@media (orientation: landscape) {

    .ec-councillor {
        width: 100%;
        grid-template-columns: 40% 60%;
        min-width: auto;
        margin-bottom: 1rem;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .ec-councillor-image {
        width: 100%;
        height: auto;
    }

    @media (min-width: 1200px) {

        .ec-councillor {
            grid-template-columns: 8rem auto;
        }

        .ec-councillor-image {
            width: 8rem;
        }
    }

    @media (min-width: 1400px) {

        .ec-councillor {
            grid-template-columns: 10rem auto;
        }

        .ec-councillor-image {
            width: 10rem;
        }
    }
}
</style>