// @ts-check
import '../style.css';
import { createMachine, assign, interpret, send } from 'xstate';
import { raise } from 'xstate/lib/actions';
import elements from '../utils/elements';

const playerMachine = createMachine({
  initial: 'loading',
  states: {
    loading: {
      on: {
        LOADED: {
          actions: "assignSong",
          target: 'playing',
        },
      },
    },
    paused: {
      on: {
        PLAY: { target: 'playing' },
      },
    },
    playing: {
      entry: "playAudio",
      exit: "pauseAudio",
      on: {
        PAUSE: { target: 'paused' },
      },
    },
  },
  on: {
    SKIP: {
      actions: "skipSong",
      target: 'loading',
    },
    LIKE: {
      actions: "likeSong",
    },
    UNLIKE: {
      actions: "unlikeSong",
    },
    DISLIKE: {
      actions: ['unlikeSong', raise("SKIP")]
    },
    VOLUME: {
      actions: "setVolume"
    },
  },
}).withConfig({
  actions: {
    assignSong: () => {
      console.log("Assign song action.")
    },
    playAudio: () => {
      console.log("Play audio action.")
    },
    pauseAudio: () => {
      console.log("Pause audio action.")
    },
    skipSong: () => {
      console.log("Skip song action.")
    },
    likeSong: () => {
      console.log("Like song action.")
    },
    unlikeSong: () => {
      console.log("Unlike song action.")
    },
    setVolume: () => {
      console.log("Set volume action.")
    },
  },
});

elements.elPlayButton?.addEventListener('click', () => {
  service.send({ type: 'PLAY' });
});
elements.elPauseButton?.addEventListener('click', () => {
  service.send({ type: 'PAUSE' });
});
elements.elSkipButton?.addEventListener('click', () => {
  service.send({ type: 'SKIP' });
});
elements.elLikeButton?.addEventListener('click', () => {
  service.send({ type: 'LIKE' });
});
elements.elDislikeButton?.addEventListener('click', () => {
  service.send({ type: 'DISLIKE' });
});

const service = interpret(playerMachine).start();

service.subscribe((state) => {
  console.log(state.actions);

  elements.elLoadingButton.hidden = !state.matches('loading');
  elements.elPlayButton.hidden = !state.can({ type: 'PLAY' });
  elements.elPauseButton.hidden = !state.can({ type: 'PAUSE' });
});

service.send('LOADED');
