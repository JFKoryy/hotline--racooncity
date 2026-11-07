// ===== Hotline RacoonCity - Paso 1b: estilo + decisión de armas =====

const SPEED = 180;
const PLAYER_MAX_HEALTH = 450;
const PLAYER_BASE_SPEED = SPEED * .5;
const ZOMBIE_SPEED_FACTOR = .65;
const ZOMBIE_CONTACT_DAMAGE = { normal: 35, bulky: 50 };
const ZOMBIE_ATTACK_COOLDOWN = 1250;
const FINAL_BOSS_SPEED = 38;
const FINAL_BOSS_NORMAL_DAMAGE = 70;
const FINAL_BOSS_STRONG_DAMAGE = 100;
const FINAL_BOSS_ATTACK_RANGE = 73.6;
const FINAL_BOSS_ATTACK_COOLDOWN = 1600;
const FINAL_BOSS_ATTACK_FRAMES = [
  [0, 1, 3, 3, 5],
  [0, 2, 3, 3, 5],
  [0, 2, 2, 5, 5],
  [0, 2, 2, 5, 5],
];
const FINAL_BOSS_STRONG_ATTACK_FRAMES = [
  [0, 1, 3, 5, 5],
  [0, 2, 3, 5, 5],
  [0, 2, 5, 5, 5],
  [0, 2, 5, 5, 5],
];
const ZOMBIE_STUN_DURATION = 1000;
const FINAL_BOSS_MAX_HEALTH = 2000;
const FINAL_BOSS_EXPLOSIVE_THRESHOLD = .4;
const FINAL_BOSS_BARREL_POSITION = { x: 585, y: 365 };
const BAT_SWING_ARC = Math.PI / 3;
const BAT_KNOCKBACK_SPEED = 75;
const BAT_KNOCKBACK_DURATION = 180;
const PLAYER_INVULNERABLE = true;
const ZOMBIE_FLASHLIGHT_SPEED_FACTOR = 1.5;
const STARTING_AMMO = { pistola: 15, escopeta: 7 };
const HEALING_TYPES = {
  small: { name: 'cura pequeña', health: 35, size: 32, crop: [120, 330, 510, 1030] },
  medium: { name: 'cura mediana', health: 50, size: 42, crop: [770, 350, 1380, 1120] },
  large: { name: 'cura grande', health: 75, size: 50, crop: [1530, 320, 2350, 1140] },
};
const HEALING_ITEMS = [
  { id: 'heal-reception', type: 'small', room: 'recepcion' },
  { id: 'heal-hallway', type: 'medium', room: 'pasillo' },
  { id: 'heal-rest-room', type: 'small', room: 'descanso' },
  { id: 'heal-cells', type: 'medium', room: 'celdas' },
  { id: 'heal-basement', type: 'small', room: 'sotano' },
  { id: 'heal-control-room', type: 'large', room: 'sala-control' },
  { id: 'heal-patio-large-1', type: 'large', room: 'patio' },
  { id: 'heal-patio-large-2', type: 'large', room: 'patio' },
  { id: 'heal-patio-medium', type: 'medium', room: 'patio' },
];
const AMMO_ITEMS = [
  { id: 'ammo-reception', weapon: 'pistola', amount: 8, room: 'recepcion' },
  { id: 'ammo-hallway', weapon: 'escopeta', amount: 4, room: 'pasillo' },
  { id: 'ammo-rest-room', weapon: 'pistola', amount: 8, room: 'descanso' },
  { id: 'ammo-cells', weapon: 'escopeta', amount: 4, room: 'celdas' },
  { id: 'ammo-basement', weapon: 'pistola', amount: 8, room: 'sotano' },
  { id: 'ammo-control-room', weapon: 'escopeta', amount: 4, room: 'sala-control' },
  { id: 'ammo-patio-boss', weapon: 'pistola', amount: 30, room: 'patio' },
];
const RESOURCE_SPAWN_POINTS = {
  recepcion: [[220, 340], [480, 300], [300, 500], [680, 350], [500, 500]],
  pasillo: [[400, 145], [400, 510], [480, 510]],
  descanso: [[300, 490], [620, 500], [200, 250], [520, 500]],
  celdas: [[480, 480], [620, 330], [500, 230], [520, 500], [470, 240]],
  sotano: [[140, 120], [400, 390], [500, 460], [300, 280]],
  'sala-control': [[400, 150], [450, 470], [220, 280], [350, 450], [450, 520]],
  patio: [[310, 465], [490, 465], [400, 220], [400, 535]],
};
const ROOM_ZOMBIE_SPAWN_POINTS = {
  pasillo: [[400, 250]],
  descanso: [[200, 350], [600, 250], [600, 450], [200, 510]],
  sotano: [[500, 460], [430, 470], [405, 400]],
  'sala-control': [
    [340, 120], [180, 280], [460, 120], [280, 470],
    [520, 450], [700, 120], [280, 150],
  ],
};
const DEBUG_COLLIDERS = false; // true = muestra las colisiones en rojo
const $ = (id) => document.getElementById(id);
const SPRITE_FRAME_WIDTH = 288;
const SPRITE_FRAME_HEIGHT = 224;
const SPRITE_SHEET_LEFT = 192;
const SPRITE_LABEL_RIGHT = 232;
const WEAPON_FRAME_COUNT = 6;
const SHOTGUN_COLUMNS = 5;
const SHOTGUN_ROWS = 5;
const DIRECTIONS = ['south', 'southeast', 'east', 'northeast', 'north', 'northwest', 'west', 'southwest'];
const MOVEMENT_DIRECTIONS = ['east', 'southeast', 'south', 'southwest', 'west', 'northwest', 'north', 'northeast'];
const ATTACK_FRAMES = [1, 2, 3, 4, 5];
const WEAPON_AIM_FRAME = 1;
const SHOTGUN_AIM_FRAMES = {
  south: 1, southeast: 3, east: 3, northeast: 3,
  north: 2, northwest: 2, west: 4, southwest: 4,
};
const SHOTGUN_ATTACK_FRAMES = {
  south: [5, 6, 7],
  east: [6, 7, 8],
  north: [11, 12, 13],
  west: [16, 17, 18],
};
const ZOMBIE_VARIANTS = [
  { id: 'civilian', name: 'civil', row: 2, deadRow: 0, deadFrame: 2, health: 150 },
  { id: 'cop', name: 'policía', row: 3, deadRow: 5, deadFrame: 0, health: 250 },
  { id: 'bulky', name: 'bulky', row: 6, deadRow: 7, deadFrame: 5, health: 400 },
];

// Daño en puntos de vida; precisión interpolada linealmente según la distancia.
const WEAPONS = {
  pistola: {
    nombre: 'Pistola', tipo: 'A distancia',
    damage: 50, criticalChance: 10, range: 340, accuracyNear: 90, accuracyNearDistance: 60, accuracyFar: 30,
    desc: 'Empieza con 15 balas. Daño: 50 PV. Precisión: 90 % a 60 px, baja hasta 30 % a 340 px. 10 % de crítico: daño doble y aturde 1 s.',
  },
  bate: {
    nombre: 'Bate', tipo: 'Cuerpo a cuerpo',
    damage: 35, criticalChance: 50, range: 110, accuracyNear: 90, accuracyNearDistance: 40, accuracyFar: 55,
    desc: 'Daño: 35 PV. Alcance: 110 px. Precisión: 90 % a 40 px, baja hasta 55 % al alcance máximo. 50 % de crítico: daño doble y aturde 1 s.',
  },
  escopeta: {
    nombre: 'Escopeta', tipo: 'A distancia',
    damage: 75, damageFar: 25, criticalChance: 35, criticalDamage: 110,
    range: 255, accuracyNear: 100, accuracyNearDistance: 40, accuracyFar: 55,
    desc: 'Empieza con 7 cartuchos. Alcance: 255 px (75 % del alcance de la pistola). Daño: 75 PV de cerca, baja hasta 25 PV al máximo alcance. Precisión: 100 % a 40 px, baja hasta 55 %. 35 % de crítico: 110 PV.',
  },
};

const NOTA_1 = {
  titulo: 'NOTA 1 · RECEPCIÓN',
  parrafos: [
    'Si alguien logra entrar, espero que estés a salvo; sin embargo, no recomiendo quedarte mucho tiempo aquí. Hay zombies por toda la comisaría, este es mi primer día y ya todo se fue al carajo. El agente M no logró sobrevivir, espero que descanse en paz.',
    'Trata de buscar una salida por el patio de la comisaría; logré encerrar a uno de los agentes que está infectado en el área de celdas; ten mucho cuidado si buscas pasar por ahí.',
    'No mueras.',
  ],
  firma: '— LSK',
};
const NOTA_PC = {
  titulo: 'POST-IT · PC DE CELDAS',
  parrafos: [
    'Como sé que siempre olvidas la contraseña, te la anoto aquí:',
    'Usuario: admin',
    'Contraseña: admin',
    'Los ingenieros nos odian porque dicen que esto no es seguro, pero tú tampoco te ayudas.',
  ],
  firma: '— Un compañero',
};
const NOTA_DESCANSO = {
  titulo: 'HOJAS SUELTAS · SALA DE DESCANSO',
  parrafos: [
    'Pasé por aquí, encontré un letrero de bienvenida, esto es muy triste. Pensar que iba apenas a conocerlos y ya los tuve que ver morir. Todo por culpa de los malditos zombies. ¿Por qué carajos pasa esto?',
    'Traté de salir por la puerta del patio; parece cerrada por electricidad. Revisaré el resto del lugar, debe haber algo para abrirla.',
  ],
  firma: '— LSK',
};
const NOTA_CONTROL = {
  titulo: 'NOTA · SALA DE CONTROL',
  parrafos: [
    'El ingeniero que diseñó esto no era muy hábil ¿quien pone un botón para abrir la puerta del patio aquí? y por qué es tan grande?',
    'No importa, si necesitas abrirlo porque hay una emergencia, presionalo.',
    'Los fusibles pueden fallar. En ese caso, el Jefe dejó uno de repuesto en la sala de descanso.',
  ],
  firma: '— Un empleado',
};
const COMPUTER_FRAME_WIDTH = 800;
const COMPUTER_FRAME_HEIGHT = 896;

class Recepcion extends Phaser.Scene {
  constructor() {
    super('Recepcion');
    this.weapon = null;                    // arma equipada (null = desarmado)
    this.playerHealth = PLAYER_MAX_HEALTH;
    this.ammo = { pistola: 0, escopeta: 0 };
    this.firearmsAcquired = new Set();
    this.lastZombieAttackAt = -Infinity;
    this.zombieStunnedUntil = 0;
    this.zombieKnockbackUntil = 0;
    this.playerAlive = true;
    this.corpse = ['pistola', 'bate'];     // armas que quedan en el cadáver
    this.ui = null;                        // null | 'choice' | 'note'
    this.zombie = null;
    this.zombieVariant = null;
    this.zombieHealth = 0;
    this.zombieSpawned = false;
    this.zombieState = 'absent';
    this.roomZombies = [];
    this.spawnedRoomEncounters = new Set();
    this.entryDoor = null;
    this.entryDoorState = 'locked';
    this.doorBlockedNotified = false;
    this.hallwayEntered = false;
    this.currentRoom = 'recepcion';
    this.gameStarted = false;
    this.doorAnimationPlayed = false;
    this.collectedHealingItems = new Set();
    this.collectedAmmoItems = new Set();
    this.healingItems = [];
    this.ammoItems = [];
    this.noteRead = false;
    this.cellDoorStates = ['closed', 'closed', 'closed'];
    this.cellZombies = [];
    this.restRoomKeyCollected = false;
    this.restRoomWeapon = 'escopeta';
    this.restRoomWeaponSprite = null;
    this.basementLockpickCollected = false;
    this.basementUnlocked = false;
    this.basementDoorOpened = false;
    this.basementPuzzleProgress = [];
    this.basementLockpickSprite = null;
    this.restNoteRead = false;
    this.controlRoomNoteRead = false;
    this.controlRoomLightsOff = false;
    this.controlRoomFlashlightOn = false;
    this.controlRoomNote = null;
    this.controlRoomNoteGlint = null;
    this.restRoomSpareFuseCollected = false;
    this.restRoomSpareFuseSprite = null;
    this.patioDoorUnlocked = false;
    this.hudHidden = false;
    this.computerValidationTimer = null;
    this.computerKeyboardCaptureRemoved = false;
    this.musicTracks = null;
    this.currentMusicMode = null;
  }

  // ---------- Construcción de la escena ----------
  preload() {
    this.load.image('recepcion', 'assets/recepcion.jpg');
    this.load.image('pasillo', 'assets/pasillo.jpg');
    this.load.image('celdas', 'assets/celdas.jpg');
    this.load.image('sala-descanso', 'assets/sala-descanso.jpg');
    this.load.image('sotano', 'assets/sotano.jpg');
    this.load.image('sala-control', 'assets/SalaControl.jpg');
    this.load.image('patio', 'assets/patio.jpg');
    this.load.image('final-boss-sheet', 'assets/FinalBoss.jpg');
    this.load.image('final-boss-attacks-sheet', 'assets/Ataques.jpg');
    this.load.image('computer-sheet', 'assets/computador.jpg');
    this.load.image('cell-door-sheet', 'assets/puerta-celda.jpg');
    this.load.image('character-sheet', 'assets/personaje.jpg');
    this.load.image('marvin', 'assets/marvin-sprite.png');
    this.load.image('bat-sheet', 'assets/Sprite-bate.jpg');
    this.load.image('pistol-sheet', 'assets/Sprite-pistola.jpg');
    this.load.image('shotgun-sheet', 'assets/escopeta.jpg');
    this.load.image('zombie-sheet', 'assets/zombie.jpg');
    this.load.image('healing-sheet', 'assets/curas.jpg');
    this.load.audio('music-normal', 'assets/audios/safe.mp3');
    this.load.audio('music-zombie', 'assets/audios/zombie.mp3');
    this.load.audio('music-final-boss', 'assets/audios/pelea final.mp3');
    this.load.audio('shot-pistol', 'assets/audios/pistola.mp3');
    this.load.audio('shot-shotgun', 'assets/audios/escopeta.mp3');
  }

  create() {
    const replayRequested = sessionStorage.getItem('hotline-start-game') === '1';
    sessionStorage.removeItem('hotline-start-game');
    this.gameStarted = replayRequested;
    this.game.canvas.tabIndex = 0;
    $('game-over').classList.add('hidden');
    this.controlRoomLightCanvas = $('control-room-light');
    this.controlRoomLightContext = this.controlRoomLightCanvas.getContext('2d');
    this.musicTracks = {
      normal: this.sound.add('music-normal', { loop: true, volume: .35 }),
      zombie: this.sound.add('music-zombie', { loop: true, volume: .35 }),
      finalBoss: this.sound.add('music-final-boss', { loop: true, volume: .35 }),
    };
    this.weaponSounds = {
      pistola: this.sound.add('shot-pistol').setVolume(.3),
      escopeta: this.sound.add('shot-shotgun').setVolume(.6),
    };
    if (replayRequested) {
      $('main-menu').classList.add('hidden');
      $('game-ui').classList.remove('hidden');
      this.game.canvas.focus();
    } else {
      $('game-ui').classList.add('hidden');
    }

    this.walls = this.physics.add.staticGroup();

    // Fondo pintado de la habitación
    this.roomBackground = this.add.image(400, 300, 'recepcion').setDisplaySize(800, 600);
    this.patioBackground = this.createPatioBackground();
    this.createPlayerTexture();
    this.createWeaponTexture('bat', 'bat-sheet');
    this.createWeaponTexture('pistol', 'pistol-sheet');
    this.createShotgunTexture();
    this.createFinalBossTextures();
    this.createZombieTextures();
    this.initializeResourcePlacement();
    this.createHealingTextures();
    this.createAmmoPickups();
    this.createComputerTextures();
    this.createCellDoorTextures();
    this.createEntryDoor();

    this.createReceptionWalls();

    // Cadáver del Agente M y sus armas
    this.corpseSprite = this.add.image(585, 375, 'marvin').setDisplaySize(72, 69).setDepth(1);
    this.itemPistola = this.add.rectangle(577, 392, 14, 6, 0x1c1c20).setStrokeStyle(1, 0x7a7a80).setDepth(1);
    this.itemBate = this.add.rectangle(609, 388, 30, 6, 0x6b4426).setStrokeStyle(1, 0x2a1809).setDepth(1).setRotation(-.5);
    this.tweens.add({ targets: [this.itemPistola, this.itemBate], alpha: .5, yoyo: true, repeat: -1, duration: 800 });

    // La nota está pintada en el mostrador del fondo; el destello guía hasta leerla.
    this.noteGlint = this.add.star(465, 174, 4, 1.5, 5, 0xffffff).setDepth(5);
    this.tweens.add({ targets: this.noteGlint, alpha: .2, scale: .65, yoyo: true, repeat: -1, duration: 450 });
    this.restNoteGlint = this.add.star(652, 274, 4, 1.5, 5, 0xffffff).setDepth(5).setVisible(false);
    this.tweens.add({ targets: this.restNoteGlint, alpha: .2, scale: .65, yoyo: true, repeat: -1, duration: 450 });
    this.cellDoors = [170, 330, 510].map((y, index) => this.add.image(344, y, 'cell-door-0')
      .setOrigin(.1, 1)
      .setScale(.12)
      .setDepth(2.8)
      .setVisible(false)
      .setData('doorIndex', index));
    this.createRestRoomKey();
    this.createBasementLockpick();
    this.createControlRoomNote();
    this.createRestRoomSpareFuse();
    this.setRestRoomWeaponSprite();

    // Personaje animado: ocho direcciones, con cinco poses por dirección.
    this.player = this.add.sprite(400, 420, 'player', 'south-0').setOrigin(.5, .9).setScale(.33).setDepth(3);
    this.physics.add.existing(this.player);
    this.player.body.setSize(60, 48).setOffset(114, 142);
    this.player.body.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.walls);
    this.createCellZombies();
    this.createFinalBoss();
    // Controles
    this.aiming = false;
    this.aimDirection = 'south';
    this.attackInProgress = false;
    this.attackAnimationCompleteHandler = null;
    this.keys = this.input.keyboard.addKeys('W,A,S,D,E,UP,DOWN,LEFT,RIGHT');
    this.movementKeys = new Set();
    this.input.keyboard.addCapture([
      Phaser.Input.Keyboard.KeyCodes.UP,
      Phaser.Input.Keyboard.KeyCodes.DOWN,
      Phaser.Input.Keyboard.KeyCodes.LEFT,
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
    ]);
    this.input.mouse.disableContextMenu();
    this.input.on('pointerdown', (pointer) => {
      if (this.ui) return;
      if (pointer.button === 2) {
        this.aiming = !!this.weapon;
        if (this.aiming) this.updateAimDirection(pointer);
      } else if (pointer.button === 0 && this.aiming) {
        this.attack(this.aimDirection);
      }
    });
    this.input.on('pointermove', (pointer) => {
      if (this.aiming && !this.attackInProgress) this.updateAimDirection(pointer);
    });
    const stopAiming = (pointer) => {
      if (pointer.button !== 2) return;
      this.aiming = false;
      if (!this.attackInProgress) this.setPlayerIdle();
    };
    this.input.on('pointerup', stopAiming);
    this.input.on('pointerupoutside', stopAiming);
    this.input.on('gameout', () => {
      this.aiming = false;
      if (!this.attackInProgress) this.setPlayerIdle();
    });
    this.keydownHandler = (ev) => {
      const key = ev.key.toLowerCase();
      if (!this.ui && ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        this.movementKeys.add(key);
      }
      this.onKey(ev);
    };
    this.keyupHandler = (ev) => this.movementKeys.delete(ev.key.toLowerCase());
    this.clearMovementKeys = () => this.movementKeys.clear();
    this.clearMovementKeysWhenHidden = () => {
      if (document.hidden) this.clearMovementKeys();
    };
    window.addEventListener('keydown', this.keydownHandler, true);
    window.addEventListener('keyup', this.keyupHandler, true);
    window.addEventListener('blur', this.clearMovementKeys);
    document.addEventListener('visibilitychange', this.clearMovementKeysWhenHidden);
    this.input.on('pointerdown', () => this.game.canvas.focus());
    this.events.once('shutdown', () => {
      window.removeEventListener('keydown', this.keydownHandler, true);
      window.removeEventListener('keyup', this.keyupHandler, true);
      window.removeEventListener('blur', this.clearMovementKeys);
      document.removeEventListener('visibilitychange', this.clearMovementKeysWhenHidden);
    });

    this.setReceptionInteractables();

    this.refresh();
    this.updateHealthHud();
  }

  clearFrameBackground(context, x, y, width, height, background = 'black') {
    const image = context.getImageData(x, y, width, height);
    const { data } = image;
    const visited = new Uint8Array(width * height);
    const queue = new Int32Array(visited.length);
    let head = 0;
    let tail = 0;
    const enqueueIfBackground = (pixel) => {
      if (visited[pixel]) return;
      const offset = pixel * 4;
      const red = data[offset];
      const green = data[offset + 1];
      const blue = data[offset + 2];
      const isBackground = background === 'white'
        ? red > 220 && green > 220 && blue > 220
          && Math.max(red, green, blue) - Math.min(red, green, blue) < 28
        : red <= 10 && green <= 10 && blue <= 10;
      if (!isBackground) return;
      visited[pixel] = 1;
      queue[tail] = pixel;
      tail += 1;
    };

    for (let frameX = 0; frameX < width; frameX += 1) {
      enqueueIfBackground(frameX);
      enqueueIfBackground((height - 1) * width + frameX);
    }
    for (let frameY = 1; frameY < height - 1; frameY += 1) {
      enqueueIfBackground(frameY * width);
      enqueueIfBackground(frameY * width + width - 1);
    }
    while (head < tail) {
      const pixel = queue[head];
      head += 1;
      data[pixel * 4 + 3] = 0;
      const frameX = pixel % width;
      const frameY = Math.floor(pixel / width);
      if (frameX > 0) enqueueIfBackground(pixel - 1);
      if (frameX < width - 1) enqueueIfBackground(pixel + 1);
      if (frameY > 0) enqueueIfBackground(pixel - width);
      if (frameY < height - 1) enqueueIfBackground(pixel + width);
    }
    context.putImageData(image, x, y);
  }

  createPlayerTexture() {
    const columns = 5;
    const canvas = document.createElement('canvas');
    canvas.width = SPRITE_FRAME_WIDTH * columns;
    canvas.height = SPRITE_FRAME_HEIGHT * DIRECTIONS.length;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const source = this.textures.get('character-sheet').getSourceImage();

    DIRECTIONS.forEach((direction, row) => {
      for (let column = 0; column < columns; column += 1) {
        const x = column * SPRITE_FRAME_WIDTH;
        const y = row * SPRITE_FRAME_HEIGHT;
        const sourceX = SPRITE_SHEET_LEFT + x;
        const cropX = column === 0 ? Math.max(sourceX, SPRITE_LABEL_RIGHT) : sourceX;
        const cropWidth = SPRITE_FRAME_WIDTH - (cropX - sourceX);
        context.drawImage(source, cropX, y, cropWidth, SPRITE_FRAME_HEIGHT, x + cropX - sourceX, y, cropWidth, SPRITE_FRAME_HEIGHT);

        this.clearFrameBackground(context, x, y, SPRITE_FRAME_WIDTH, SPRITE_FRAME_HEIGHT);
      }
    });

    const texture = this.textures.addCanvas('player', canvas);
    DIRECTIONS.forEach((direction, row) => {
      const firstWalkFrame = direction === 'east' ? 1 : 0;
      for (let frame = firstWalkFrame; frame < columns; frame += 1) {
        texture.add(
          `${direction}-${frame}`,
          0,
          frame * SPRITE_FRAME_WIDTH,
          row * SPRITE_FRAME_HEIGHT,
          SPRITE_FRAME_WIDTH,
          SPRITE_FRAME_HEIGHT,
        );
      }
      this.anims.create({
        key: `walk-${direction}`,
        frames: Array.from(
          { length: columns - firstWalkFrame },
          (_, index) => ({ key: 'player', frame: `${direction}-${index + firstWalkFrame}` }),
        ),
        frameRate: 8,
        repeat: -1,
      });
    });
    texture.refresh();
  }

  createWeaponTexture(weapon, sourceKey) {
    const canvas = document.createElement('canvas');
    canvas.width = SPRITE_FRAME_WIDTH * WEAPON_FRAME_COUNT;
    canvas.height = SPRITE_FRAME_HEIGHT * DIRECTIONS.length;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const source = this.textures.get(sourceKey).getSourceImage();
    const texture = this.textures.addCanvas(`weapon-${weapon}`, canvas);

    DIRECTIONS.forEach((direction, row) => {
      for (let frame = 0; frame < WEAPON_FRAME_COUNT; frame += 1) {
        const x = frame * SPRITE_FRAME_WIDTH;
        const y = row * SPRITE_FRAME_HEIGHT;
        const sourceX = SPRITE_SHEET_LEFT + x;
        const cropX = frame === 0 ? Math.max(sourceX, SPRITE_LABEL_RIGHT) : sourceX;
        const cropWidth = SPRITE_FRAME_WIDTH - (cropX - sourceX);
        context.drawImage(
          source,
          cropX, y, cropWidth, SPRITE_FRAME_HEIGHT,
          x + cropX - sourceX, y, cropWidth, SPRITE_FRAME_HEIGHT,
        );
        this.clearFrameBackground(context, x, y, SPRITE_FRAME_WIDTH, SPRITE_FRAME_HEIGHT);
        texture.add(`${direction}-${frame}`, 0, x, y, SPRITE_FRAME_WIDTH, SPRITE_FRAME_HEIGHT);
      }

      this.anims.create({
        key: `attack-${weapon}-${direction}`,
        frames: ATTACK_FRAMES.map((frame) => ({ key: `weapon-${weapon}`, frame: `${direction}-${frame}` })),
        frameRate: weapon === 'bate' ? 8 : 10,
        repeat: 0,
      });
    });
    texture.refresh();
  }

  createShotgunTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = SPRITE_FRAME_WIDTH * SHOTGUN_COLUMNS;
    canvas.height = SPRITE_FRAME_HEIGHT * SHOTGUN_ROWS;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const source = this.textures.get('shotgun-sheet').getSourceImage();
    const texture = this.textures.addCanvas('weapon-shotgun', canvas);
    const sourceFrameWidth = source.width / SHOTGUN_COLUMNS;
    const sourceFrameHeight = source.height / SHOTGUN_ROWS;

    for (let frame = 0; frame < SHOTGUN_COLUMNS * SHOTGUN_ROWS; frame += 1) {
      const sourceX = (frame % SHOTGUN_COLUMNS) * sourceFrameWidth;
      const sourceY = Math.floor(frame / SHOTGUN_COLUMNS) * sourceFrameHeight;
      const tile = document.createElement('canvas');
      tile.width = Math.ceil(sourceFrameWidth);
      tile.height = Math.ceil(sourceFrameHeight);
      const tileContext = tile.getContext('2d', { willReadFrequently: true });
      tileContext.drawImage(
        source,
        sourceX, sourceY, sourceFrameWidth, sourceFrameHeight,
        0, 0, tile.width, tile.height,
      );
      this.clearFrameBackground(tileContext, 0, 0, tile.width, tile.height, 'white');

      const pixels = tileContext.getImageData(0, 0, tile.width, tile.height).data;
      let left = tile.width;
      let top = tile.height;
      let right = -1;
      let bottom = -1;
      for (let y = 0; y < tile.height; y += 1) {
        for (let x = 0; x < tile.width; x += 1) {
          if (pixels[(y * tile.width + x) * 4 + 3] === 0) continue;
          left = Math.min(left, x);
          top = Math.min(top, y);
          right = Math.max(right, x);
          bottom = Math.max(bottom, y);
        }
      }

      if (right < left || bottom < top) continue;
      const contentWidth = right - left + 1;
      const contentHeight = bottom - top + 1;
      const scale = Math.min(250 / contentWidth, 200 / contentHeight);
      const width = contentWidth * scale;
      const height = contentHeight * scale;
      const x = (frame % SHOTGUN_COLUMNS) * SPRITE_FRAME_WIDTH
        + (SPRITE_FRAME_WIDTH - width) / 2;
      const y = Math.floor(frame / SHOTGUN_COLUMNS) * SPRITE_FRAME_HEIGHT
        + 210 - height;
      context.drawImage(
        tile,
        left, top, contentWidth, contentHeight,
        x, y, width, height,
      );
      texture.add(
        `frame-${frame}`,
        0,
        (frame % SHOTGUN_COLUMNS) * SPRITE_FRAME_WIDTH,
        Math.floor(frame / SHOTGUN_COLUMNS) * SPRITE_FRAME_HEIGHT,
        SPRITE_FRAME_WIDTH,
        SPRITE_FRAME_HEIGHT,
      );
    }

    Object.entries(SHOTGUN_ATTACK_FRAMES).forEach(([direction, frames]) => {
      this.anims.create({
        key: `attack-shotgun-${direction}`,
        frames: frames.map((frame) => ({ key: 'weapon-shotgun', frame: `frame-${frame}` })),
        frameRate: 12,
        repeat: 0,
      });
    });
    texture.refresh();
  }

  createFinalBossTextures() {
    const createSheet = (sourceKey, textureKey, framePrefix, background) => {
      const source = this.textures.get(sourceKey).getSourceImage();
      const columns = 6;
      const rows = 4;
      const sourceFrameWidth = source.width / columns;
      const sourceFrameHeight = source.height / rows;
      const frameWidth = Math.ceil(sourceFrameWidth);
      const frameHeight = Math.ceil(sourceFrameHeight);
      const canvas = document.createElement('canvas');
      canvas.width = frameWidth * columns;
      canvas.height = frameHeight * rows;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.imageSmoothingEnabled = false;
      const texture = this.textures.addCanvas(textureKey, canvas);

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const x = column * frameWidth;
          const y = row * frameHeight;
          context.drawImage(
            source,
            column * sourceFrameWidth,
            row * sourceFrameHeight,
            sourceFrameWidth,
            sourceFrameHeight,
            x,
            y,
            frameWidth,
            frameHeight,
          );
          this.clearFrameBackground(context, x, y, frameWidth, frameHeight, background);
          texture.add(`${framePrefix}-${row}-${column}`, 0, x, y, frameWidth, frameHeight);
        }
      }

      texture.refresh();
      return columns;
    };

    const columns = createSheet('final-boss-sheet', 'final-boss', 'walk', 'white');
    createSheet('final-boss-attacks-sheet', 'final-boss-attacks', 'attack', 'black');

    for (let row = 0; row < 4; row += 1) {
      this.anims.create({
        key: `final-boss-walk-${row}`,
        frames: Array.from({ length: columns }, (_, column) => ({
          key: 'final-boss',
          frame: `walk-${row}-${column}`,
        })),
        frameRate: 7,
        repeat: -1,
      });
      this.anims.create({
        key: `final-boss-attack-${row}`,
        frames: FINAL_BOSS_ATTACK_FRAMES[row].map((column) => ({
          key: 'final-boss-attacks',
          frame: `attack-${row}-${column}`,
        })),
        frameRate: 7,
        repeat: 0,
      });
      this.anims.create({
        key: `final-boss-strong-attack-${row}`,
        frames: FINAL_BOSS_STRONG_ATTACK_FRAMES[row].map((column) => ({
          key: 'final-boss-attacks',
          frame: `attack-${row}-${column}`,
        })),
        frameRate: 6,
        repeat: 0,
      });
    }
  }

  createFinalBoss() {
    this.finalBossAttacking = false;
    this.finalBossNextAttackAt = 0;
    this.finalBossAttackCount = 0;
    this.finalBossHealth = FINAL_BOSS_MAX_HEALTH;
    this.finalBossDefeated = false;
    this.finalBossExplosiveUsed = false;
    this.finalBossKeyCollected = false;
    this.bossArenaSuppliesPrepared = false;
    this.patioGateUnlocked = false;
    this.finalBoss = this.physics.add.sprite(400, 300, 'final-boss', 'walk-0-0')
      .setOrigin(.5, .82)
      .setScale(.336)
      .setDepth(3.1)
      .setVisible(false);
    this.finalBoss.body.setSize(230, 190).setOffset(114, 170);
    this.finalBoss.body.setCollideWorldBounds(true);
    this.finalBoss.body.enable = false;
    this.physics.add.collider(this.finalBoss, this.walls);
    this.createPatioExplosive();
    this.createFinalBossKey();
    this.patioGateOpenVisual = this.add.graphics().setDepth(2.4).setVisible(false);
    this.patioGateOpenVisual.fillStyle(0x101215, 1);
    this.patioGateOpenVisual.fillRect(344, 58, 112, 95);
    this.patioGateOpenVisual.lineStyle(6, 0x4a4640, 1);
    this.patioGateOpenVisual.lineBetween(344, 58, 370, 145);
    this.patioGateOpenVisual.lineBetween(370, 145, 370, 58);
    this.patioGateOpenVisual.lineBetween(456, 58, 430, 145);
    this.patioGateOpenVisual.lineBetween(430, 145, 430, 58);
    this.patioGateOpenVisual.setVisible(false);
  }

  createBarrelVisual(x, y, scale = 1, glow = false) {
    const barrel = this.add.container(x, y).setScale(scale);
    if (glow) {
      barrel.add(this.add.circle(0, 0, 34, 0xff692b, .3));
      barrel.add(this.add.circle(0, 0, 25, 0xffb35a, .28));
    }
    const art = this.add.graphics();
    art.fillStyle(0x702d22, 1);
    art.fillRoundedRect(-16, -24, 32, 48, 5);
    art.lineStyle(3, 0x302a27, 1);
    art.strokeRoundedRect(-16, -24, 32, 48, 5);
    art.fillStyle(0xc4934e, 1);
    art.fillRect(-14, -17, 28, 5);
    art.fillRect(-14, 12, 28, 5);
    art.lineStyle(2, 0xe2c17c, 1);
    art.strokeEllipse(0, -22, 28, 8);
    art.lineBetween(-14, -5, 14, -5);
    barrel.add(art);
    return barrel;
  }

  createPatioExplosive() {
    const { x, y } = FINAL_BOSS_BARREL_POSITION;
    this.finalBossExplosive = this.createBarrelVisual(x, y, 1, true).setDepth(3.2);
    this.finalBossExplosive.setVisible(false);
    this.tweens.add({
      targets: this.finalBossExplosive,
      alpha: .72,
      yoyo: true,
      repeat: -1,
      duration: 500,
    });
  }

  createFinalBossKey() {
    this.finalBossKeySprite = this.add.container(0, 0).setDepth(3.3).setVisible(false);
    const art = this.add.graphics();
    art.lineStyle(4, 0xe3bd55, 1);
    art.strokeCircle(0, 0, 8);
    art.lineBetween(7, 5, 27, 20);
    art.lineBetween(20, 14, 16, 20);
    art.lineBetween(25, 17, 21, 23);
    this.finalBossKeySprite.add(art);
    this.finalBossKeyGlint = this.add.star(0, 0, 4, 3, 8, 0xffe98a)
      .setDepth(3.4)
      .setVisible(false);
    this.tweens.add({
      targets: this.finalBossKeyGlint,
      alpha: .25,
      scale: .65,
      yoyo: true,
      repeat: -1,
      duration: 450,
    });
  }

  updateFinalBossHud() {
    const show = this.currentRoom === 'patio' && !this.finalBossDefeated;
    $('boss-health-slot').classList.toggle('hidden', !show);
    if (!show) return;
    const ratio = this.finalBossHealth / FINAL_BOSS_MAX_HEALTH;
    $('boss-health-value').textContent = `${this.finalBossHealth} / ${FINAL_BOSS_MAX_HEALTH}`;
    $('boss-health-bar').style.width = `${ratio * 100}%`;
    $('boss-health-bar').style.backgroundColor = ratio <= FINAL_BOSS_EXPLOSIVE_THRESHOLD ? '#f07832' : '#b3201f';
  }

  useFinalBossExplosive() {
    if (
      this.currentRoom !== 'patio'
      || this.finalBossDefeated
      || this.finalBossExplosiveUsed
      || this.finalBossHealth > FINAL_BOSS_MAX_HEALTH * FINAL_BOSS_EXPLOSIVE_THRESHOLD
    ) return;
    this.finalBossExplosiveUsed = true;
    if (this.attackAnimationCompleteHandler) {
      this.player.off('animationcomplete', this.attackAnimationCompleteHandler);
      this.attackAnimationCompleteHandler = null;
    }
    this.attackInProgress = false;
    this.finalBossExplosive.setVisible(false);
    const startX = this.player.x;
    const startY = this.player.y - 30;
    const targetX = this.finalBoss.x;
    const targetY = this.finalBoss.y - 35;
    this.player.body.setVelocity(0, 0);
    this.player.setFlipX(targetX < startX);
    this.tweens.add({
      targets: this.player,
      y: this.player.y - 12,
      angle: -12,
      yoyo: true,
      repeat: 1,
      duration: 150,
      onComplete: () => {
        this.player.setAngle(0);
        this.setPlayerIdle();
      },
    });
    const projectile = this.createBarrelVisual(startX, startY, .55).setDepth(5);
    this.tweens.add({
      targets: projectile,
      x: targetX,
      y: targetY,
      angle: 720,
      duration: 650,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        projectile.destroy();
        const explosion = this.add.container(targetX, targetY).setDepth(5);
        explosion.add(this.add.circle(0, 0, 18, 0xffe07a, 1));
        explosion.add(this.add.circle(0, 0, 10, 0xff6a24, 1));
        this.tweens.add({
          targets: explosion,
          scale: 5,
          alpha: 0,
          duration: 500,
          onComplete: () => explosion.destroy(),
        });
        this.finalBossDefeated = true;
        this.finalBossAttacking = false;
        this.finalBoss.body.setVelocity(0, 0);
        this.finalBoss.body.enable = false;
        this.finalBoss.stop();
        this.finalBoss.setVisible(false);
        this.finalBossKeySprite.setPosition(targetX, targetY).setVisible(true);
        this.finalBossKeyGlint.setPosition(targetX, targetY - 8).setVisible(true);
        this.updateFinalBossHud();
        this.setReceptionInteractables();
        this.toast('¡El jefe cayó! Dejó una llave junto a la explosión.');
      },
    });
  }

  collectFinalBossKey() {
    if (!this.finalBossDefeated || this.finalBossKeyCollected) return;
    this.finalBossKeyCollected = true;
    this.finalBossKeySprite.setVisible(false);
    this.finalBossKeyGlint.setVisible(false);
    this.toast('Recogiste la llave de la última puerta.');
  }

  openPatioGate() {
    if (this.patioGateUnlocked) {
      this.toast('La reja ya está abierta.');
      return;
    }
    if (!this.finalBossKeyCollected) {
      this.toast('La reja está cerrada. Necesitas la llave del jefe.');
      return;
    }
    this.patioGateUnlocked = true;
    this.patioNorthBoundary.body.enable = false;
    this.patioNorthBoundary.setVisible(false);
    this.patioGateOpenVisual.setVisible(true);
    this.showFinalCredits();
  }

  showFinalCredits() {
    this.ui = 'ending-credits';
    $('modal-body').innerHTML = `
      <section class="ending-credits" aria-labelledby="ending-credits-title">
        <p class="ending-kicker">FINAL</p>
        <h2 id="ending-credits-title">Créditos</h2>
        <p class="ending-message">Gracias por llegar hasta aquí.</p>
        <ul class="credits-list">
          <li>Jesús Múnera</li>
          <li>Jesucristo</li>
          <li>Dios (tal vez)</li>
          <li>Mucha cerveza</li>
          <li>Marlboro Rojo</li>
          <li>Gemini IA</li>
          <li>Mi Copiloto</li>
        </ul>
        <p class="ending-footer">Y a todos los que hicieron posible este caos.</p>
        <button class="btn" id="close-ending-credits" type="button">VOLVER AL MENÚ PRINCIPAL</button>
      </section>`;
    $('modal-body').querySelector('#close-ending-credits').addEventListener('click', () => window.location.reload());
    $('modal').classList.remove('hidden');
  }

  createZombieTextures() {
    const columns = 6;
    const source = this.textures.get('zombie-sheet').getSourceImage();

    ZOMBIE_VARIANTS.forEach(({ id, row, deadRow, deadFrame }) => {
      const canvas = document.createElement('canvas');
      canvas.width = SPRITE_FRAME_WIDTH * (columns + 1);
      canvas.height = SPRITE_FRAME_HEIGHT;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      const texture = this.textures.addCanvas(`zombie-${id}`, canvas);

      const addFrame = (targetFrame, sourceFrame, sourceRow, textureFrame) => {
        const x = targetFrame * SPRITE_FRAME_WIDTH;
        const sourceX = SPRITE_SHEET_LEFT + sourceFrame * SPRITE_FRAME_WIDTH;
        const cropX = sourceFrame === 0 ? Math.max(sourceX, SPRITE_LABEL_RIGHT) : sourceX;
        const cropWidth = SPRITE_FRAME_WIDTH - (cropX - sourceX);
        context.drawImage(
          source,
          cropX, sourceRow * SPRITE_FRAME_HEIGHT, cropWidth, SPRITE_FRAME_HEIGHT,
          x + cropX - sourceX, 0, cropWidth, SPRITE_FRAME_HEIGHT,
        );
        this.clearFrameBackground(context, x, 0, SPRITE_FRAME_WIDTH, SPRITE_FRAME_HEIGHT);
        texture.add(textureFrame, 0, x, 0, SPRITE_FRAME_WIDTH, SPRITE_FRAME_HEIGHT);
      };

      for (let frame = 0; frame < columns; frame += 1) {
        addFrame(frame, frame, row, `${id}-${frame}`);
      }
      addFrame(columns, deadFrame, deadRow, `${id}-dead`);

      this.anims.create({
        key: `walk-zombie-${id}`,
        frames: [1, 2, 3, 4].map((frame) => ({ key: `zombie-${id}`, frame: `${id}-${frame}` })),
        frameRate: 6,
        repeat: -1,
      });
      texture.refresh();
    });
  }

  initializeResourcePlacement() {
    this.healingItems = HEALING_ITEMS.map((item) => ({
      ...item,
      ...HEALING_TYPES[item.type],
    }));
    this.ammoItems = AMMO_ITEMS.map((item) => ({ ...item }));

    Object.entries(RESOURCE_SPAWN_POINTS).forEach(([room, spawnPoints]) => {
      const roomItems = [
        ...this.healingItems.filter((item) => item.room === room),
        ...this.ammoItems.filter((item) => item.room === room),
      ];
      const availablePoints = Phaser.Utils.Array.Shuffle(spawnPoints.map(([x, y]) => ({ x, y })));
      const assignedPoints = [];

      roomItems.forEach((item) => {
        const pointIndex = availablePoints.findIndex((point) => assignedPoints.every(
          (assigned) => Phaser.Math.Distance.Between(point.x, point.y, assigned.x, assigned.y) >= 70,
        ));
        if (pointIndex < 0) throw new Error(`No hay puntos de aparición seguros en ${room}.`);
        const [point] = availablePoints.splice(pointIndex, 1);
        Object.assign(item, point);
        assignedPoints.push(point);
      });
    });
  }

  createHealingTextures() {
    const source = this.textures.get('healing-sheet').getSourceImage();
    Object.entries(HEALING_TYPES).forEach(([type, { crop }]) => {
      const [left, top, right, bottom] = crop;
      const width = right - left;
      const height = bottom - top;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(source, left, top, width, height, 0, 0, width, height);
      this.clearFrameBackground(context, 0, 0, width, height);
      this.textures.addCanvas(`heal-${type}`, canvas).refresh();
    });

    this.healingSprites = this.healingItems.map((item) => {
      const sprite = this.add.image(item.x, item.y, `heal-${item.type}`)
        .setDisplaySize(item.size, item.size)
        .setDepth(2)
        .setVisible(item.room === this.currentRoom);
      this.tweens.add({ targets: sprite, y: item.y - 3, yoyo: true, repeat: -1, duration: 700 });
      return { id: item.id, sprite };
    });
  }

  createAmmoPickups() {
    this.ammoSprites = this.ammoItems.map((item) => ({
      id: item.id,
      sprite: this.createAmmoPickup(item),
    }));
  }

  createAmmoPickup(item) {
    const sprite = this.add.container(item.x, item.y).setDepth(2);
    sprite.setVisible(item.room === this.currentRoom);
    const isPistolAmmo = item.weapon === 'pistola';
    sprite.add(this.add.circle(0, 0, 17, isPistolAmmo ? 0x9b742d : 0x78643e, .35));
    const casing = this.add.graphics();
    casing.fillStyle(0x282522, 1);
    casing.fillRoundedRect(-15, -8, 30, 16, 3);
    casing.lineStyle(2, 0xb99655, 1);
    casing.strokeRoundedRect(-15, -8, 30, 16, 3);
    casing.fillStyle(isPistolAmmo ? 0xe7bd62 : 0xc98e4c, 1);
    if (isPistolAmmo) {
      [-8, 0, 8].forEach((x) => casing.fillCircle(x, 0, 3));
    } else {
      [-7, 7].forEach((x) => casing.fillRoundedRect(x - 2, -5, 4, 10, 1));
    }
    sprite.add(casing);
    this.tweens.add({ targets: sprite, y: item.y - 3, yoyo: true, repeat: -1, duration: 700 });
    return sprite;
  }

  prepareBossArenaAmmo() {
    if (this.bossArenaSuppliesPrepared) return;

    const item = this.ammoItems.find((ammoItem) => ammoItem.id === 'ammo-patio-boss');
    const collectible = this.ammoSprites.find((ammoSprite) => ammoSprite.id === 'ammo-patio-boss');
    if (!item || !collectible) throw new Error('No se pudo preparar la munición de la arena del jefe.');

    if (this.weapon === 'pistola' || this.weapon === 'escopeta') {
      item.weapon = this.weapon;
    } else {
      const acquiredFirearms = [...this.firearmsAcquired];
      item.weapon = acquiredFirearms[acquiredFirearms.length - 1]
        || (this.corpse.includes('pistola') ? 'pistola' : 'escopeta');
    }
    collectible.sprite.destroy();
    collectible.sprite = this.createAmmoPickup(item);
    this.bossArenaSuppliesPrepared = true;
  }

  createCellDoorTextures() {
    const source = this.textures.get('cell-door-sheet').getSourceImage();
    const frameBounds = [
      [211, 154, 505, 625],
      [263, 154, 466, 693],
      [235, 154, 459, 688],
      [206, 154, 471, 711],
    ];

    frameBounds.forEach(([left, top, right, bottom], frame) => {
      const width = right - left;
      const height = bottom - top;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(source, frame * 688 + left, top, width, height, 0, 0, width, height);
      this.clearFrameBackground(context, 0, 0, width, height);
      this.textures.addCanvas(`cell-door-${frame}`, canvas).refresh();
    });
  }

  createCellZombies() {
    const positions = [[280, 140], [280, 300], [280, 480]];
    this.cellZombies = positions.map(([x, y], index) => {
      const variant = ZOMBIE_VARIANTS[0];
      const sprite = this.physics.add.sprite(x, y, `zombie-${variant.id}`, `${variant.id}-dead`)
        .setOrigin(.5, .9)
        .setScale(.29)
        .setDepth(2.6)
        .setVisible(false);
      sprite.body.setSize(60, 40).setOffset(114, 150);
      sprite.body.setCollideWorldBounds(true);
      sprite.body.enable = false;
      this.physics.add.collider(sprite, this.walls);
      this.physics.add.collider(sprite, this.player);
      return {
        sprite,
        variant,
        health: variant.health,
        state: 'sleeping',
        stunnedUntil: 0,
        knockbackUntil: 0,
        cellIndex: index,
      };
    });
  }

  createRestRoomKey() {
    const x = 220;
    const y = 515;
    this.keyGlow = this.add.circle(x, y, 14, 0xffd84a, .28).setDepth(3.2);
    this.keySprite = this.add.graphics().setPosition(x, y).setDepth(3.3);
    this.keySprite.fillStyle(0xffd84a, 1);
    this.keySprite.fillCircle(0, 0, 7);
    this.keySprite.fillStyle(0x282016, 1);
    this.keySprite.fillCircle(0, 0, 3);
    this.keySprite.fillStyle(0xffd84a, 1);
    this.keySprite.fillRect(6, -2, 24, 4);
    this.keySprite.fillRect(23, 1, 4, 6);
    this.keySprite.fillRect(29, 1, 4, 5);
    this.keyGlint = this.add.star(x - 9, y - 10, 4, 2, 6, 0xfff3a0).setDepth(3.4);
    this.tweens.add({ targets: [this.keyGlow, this.keyGlint], alpha: .25, scale: .7, yoyo: true, repeat: -1, duration: 500 });
    this.keyGlow.setVisible(false);
    this.keySprite.setVisible(false);
    this.keyGlint.setVisible(false);
  }

  createComputerTextures() {
    const source = this.textures.get('computer-sheet').getSourceImage();
    this.computerFrames = [];

    for (let frame = 0; frame < 6; frame += 1) {
      const canvas = document.createElement('canvas');
      canvas.width = COMPUTER_FRAME_WIDTH;
      canvas.height = COMPUTER_FRAME_HEIGHT;
      const context = canvas.getContext('2d');
      const column = frame % 3;
      const row = Math.floor(frame / 3);
      context.drawImage(
        source,
        column * COMPUTER_FRAME_WIDTH,
        row * COMPUTER_FRAME_HEIGHT,
        COMPUTER_FRAME_WIDTH,
        COMPUTER_FRAME_HEIGHT,
        0,
        0,
        COMPUTER_FRAME_WIDTH,
        COMPUTER_FRAME_HEIGHT,
      );
      this.computerFrames.push(canvas.toDataURL('image/png'));
    }
  }

  createEntryDoor() {
    const source = this.textures.get('recepcion').getSourceImage();
    const canvas = document.createElement('canvas');
    canvas.width = 154;
    canvas.height = 250;
    canvas.getContext('2d').drawImage(source, 284, 141, 154, 250, 0, 0, 154, 250);
    this.textures.addCanvas('entry-door', canvas).refresh();

    const opening = this.add.rectangle(143, 78, 63, 72, 0x151219).setDepth(2.5);
    const leaf = this.add.image(174, 114, 'entry-door')
      .setOrigin(1, 1)
      .setDisplaySize(63, 72)
      .setDepth(3.5);
    opening.setVisible(false);
    leaf.setVisible(false);
    this.entryDoor = { opening, leaf };
  }

  tweenDoor(angle, onComplete) {
    this.tweens.add({
      targets: this.entryDoor.leaf,
      angle,
      duration: 700,
      ease: 'Sine.easeInOut',
      onComplete,
    });
  }

  enterHallway() {
    if (
      this.currentRoom !== 'recepcion'
      || !this.zombieSpawned
      || this.entryDoorState === 'opening'
      || this.entryDoorState === 'closing'
    ) return;

    const enter = () => {
      this.doorAnimationPlayed = true;
      this.entryDoorState = 'open';
      this.doorBlocker.body.enable = false;
      this.doorBlocker.setVisible(false);
      this.hallwayEntered = true;
      this.currentRoom = 'pasillo';
      this.roomBackground.setTexture('pasillo').setDisplaySize(800, 600);
      this.walls.clear(true, true);
      this.createHallwayWalls();
      this.player.setPosition(400, 450);
      this.player.body.setVelocity(0, 0);
      this.spawnRoomEncounter('pasillo');
      this.updateRoomObjects();
      this.setReceptionInteractables();
      this.facing = 'north';
      this.setPlayerIdle();
      this.toast('Entraste al pasillo.');
    };

    if (this.doorAnimationPlayed) {
      enter();
      return;
    }

    this.doorAnimationPlayed = true;
    this.entryDoorState = 'opening';
    this.entryDoor.opening.setVisible(true);
    this.entryDoor.leaf.setVisible(true);
    this.tweenDoor(-90, enter);
  }

  returnToReception() {
    if (this.currentRoom !== 'pasillo') return;

    this.currentRoom = 'recepcion';
    this.roomBackground.setTexture('recepcion').setDisplaySize(800, 600);
    this.walls.clear(true, true);
    this.createReceptionWalls();
    this.updateRoomObjects();
    this.setReceptionInteractables();
    this.player.setPosition(144, 170);
    this.player.body.setVelocity(0, 0);
    this.facing = 'south';
    this.setPlayerIdle();
    this.toast('Volviste a la recepción.');
  }

  enterRestRoom() {
    if (this.currentRoom !== 'recepcion') return;
    if (!this.restRoomKeyCollected) {
      this.toast('Necesitas la llave de la sala de descanso.');
      return;
    }

    this.currentRoom = 'descanso';
    this.roomBackground.setTexture('sala-descanso').setDisplaySize(800, 600);
    this.walls.clear(true, true);
    this.createRestRoomWalls();
    this.player.setPosition(400, 520);
    this.player.body.setVelocity(0, 0);
    this.spawnRoomEncounter('descanso');
    this.updateRoomObjects();
    this.setReceptionInteractables();
    this.facing = 'north';
    this.setPlayerIdle();
    this.toast('Entraste a la sala de descanso.');
  }

  returnFromRestRoom() {
    if (this.currentRoom !== 'descanso') return;

    this.currentRoom = 'recepcion';
    this.roomBackground.setTexture('recepcion').setDisplaySize(800, 600);
    this.walls.clear(true, true);
    this.createReceptionWalls();
    this.updateRoomObjects();
    this.setReceptionInteractables();
    this.player.setPosition(656, 160);
    this.player.body.setVelocity(0, 0);
    this.facing = 'south';
    this.setPlayerIdle();
    this.toast('Saliste por la puerta y volviste a la recepción.');
  }

  enterBasement() {
    if (this.currentRoom !== 'recepcion') return;
    if (!this.basementLockpickCollected) {
      this.toast('La puerta está cerrada. Necesitas una ganzúa.');
      return;
    }

    this.basementUnlocked = true;
    this.toast('Utilizaste la ganzúa.');
    this.currentRoom = 'sotano';
    this.roomBackground.setTexture('sotano').setDisplaySize(800, 600);
    this.walls.clear(true, true);
    this.createBasementWalls();
    this.player.setPosition(145, 82).setScale(.5);
    this.player.body.setVelocity(0, 0);
    this.spawnRoomEncounter('sotano');
    this.updateRoomObjects();
    this.setReceptionInteractables();
    this.facing = 'southeast';
    this.setPlayerIdle();
  }

  returnFromBasement() {
    if (this.currentRoom !== 'sotano') return;

    this.currentRoom = 'recepcion';
    this.roomBackground.setTexture('recepcion').setDisplaySize(800, 600);
    this.walls.clear(true, true);
    this.createReceptionWalls();
    this.updateRoomObjects();
    this.setReceptionInteractables();
    this.player.setPosition(100, 278);
    this.player.setScale(.33);
    this.player.body.setVelocity(0, 0);
    this.facing = 'east';
    this.setPlayerIdle();
    this.toast('Volviste a la recepción por la misma puerta.');
  }

  openBasementPuzzle() {
    if (this.currentRoom !== 'sotano') return;
    if (this.basementDoorOpened) {
      this.toast('La puerta ya está abierta.');
      return;
    }

    this.basementPuzzleProgress = [];
    this.ui = 'basement-puzzle';
    const colors = [
      { id: 'yellow', label: 'Amarillo', x: 39.1, y: 33.8 },
      { id: 'blue', label: 'Azul', x: 50, y: 33.8 },
      { id: 'red', label: 'Rojo', x: 60.9, y: 33.8 },
      { id: 'green', label: 'Verde', x: 39.1, y: 53.8 },
      { id: 'purple', label: 'Púrpura', x: 50, y: 53.8 },
      { id: 'orange', label: 'Naranja', x: 60.9, y: 53.8 },
      { id: 'white', label: 'Blanco', x: 39.1, y: 74 },
      { id: 'cyan', label: 'Celeste', x: 50, y: 74 },
      { id: 'pink', label: 'Rosa', x: 60.9, y: 74 },
    ];
    $('modal-body').innerHTML = `
      <div class="basement-puzzle">
        <div class="basement-puzzle-panel">
          <img class="basement-puzzle-art" src="assets/puzzlecolores.jpg"
            alt="Panel de seguridad con botones amarillo, azul, rojo, verde, púrpura, naranja, blanco, celeste y rosa">
          <div class="basement-puzzle-buttons">
            ${colors.map(({ id, label, x, y }) => `
              <button type="button" class="basement-color-button" data-color="${id}"
                style="--button-x:${x}%;--button-y:${y}%" aria-label="${label}"></button>
            `).join('')}
          </div>
        </div>
        <p id="basement-puzzle-feedback" class="basement-puzzle-feedback" aria-live="polite">
          Introduce la secuencia de colores (${this.basementPuzzleProgress.length}/4)
        </p>
        <div class="foot"><span>Presiona ESC para cerrar.</span></div>
      </div>`;
    $('modal-body').querySelectorAll('.basement-color-button').forEach((button) => {
      button.addEventListener('click', () => this.enterBasementPuzzleColor(button.dataset.color));
    });
    $('modal').classList.remove('hidden');
  }

  enterBasementPuzzleColor(color) {
    if (this.ui !== 'basement-puzzle') return;
    const sequence = ['yellow', 'blue', 'green', 'red'];
    const expected = sequence[this.basementPuzzleProgress.length];
    if (color !== expected) {
      this.basementPuzzleProgress = [];
      $('basement-puzzle-feedback').textContent
        = 'Incorrecto. La secuencia se reinició (0/4).';
      return;
    }

    this.basementPuzzleProgress.push(color);
    if (this.basementPuzzleProgress.length === sequence.length) {
      this.basementDoorOpened = true;
      this.closeUi();
      this.toast('Puerta abierta. Acércate para entrar a la sala de control.');
      return;
    }
    $('basement-puzzle-feedback').textContent
      = `Color correcto (${this.basementPuzzleProgress.length}/4).`;
  }

  createBasementWalls() {
    this.basementWalkableAreas = [
      [[75, 35], [217, 75], [425, 374], [397, 425], [337, 395], [180, 214], [76, 125]],
      [[355, 355], [520, 360], [663, 430], [646, 520], [443, 508], [372, 438]],
    ];
  }

  enterControlRoom() {
    if (this.currentRoom !== 'sotano' || !this.basementDoorOpened) return;

    this.currentRoom = 'sala-control';
    this.roomBackground.setTexture('sala-control').setDisplaySize(800, 600);
    this.walls.clear(true, true);
    this.createControlRoomWalls();
    this.player.setPosition(460, 520).setScale(.65);
    this.player.body.setVelocity(0, 0);
    this.spawnRoomEncounter('sala-control');
    this.updateRoomObjects();
    this.setReceptionInteractables();
    this.facing = 'north';
    this.setPlayerIdle();
    this.syncControlRoomLighting();
    this.toast('Entraste a la sala de control.');
  }

  returnFromControlRoom() {
    if (this.currentRoom !== 'sala-control') return;

    this.currentRoom = 'sotano';
    this.roomBackground.setTexture('sotano').setDisplaySize(800, 600);
    this.walls.clear(true, true);
    this.createBasementWalls();
    this.updateRoomObjects();
    this.setReceptionInteractables();
    this.player.setPosition(535, 410).setScale(.5);
    this.player.body.setVelocity(0, 0);
    this.facing = 'south';
    this.setPlayerIdle();
    this.syncControlRoomLighting();
    this.toast('Volviste al sótano.');
  }

  createControlRoomWalls() {
    [
      [15, 300, 30, 600],
      [785, 300, 30, 600],
      [400, 35, 800, 70],
      [200, 585, 400, 30],
      [660, 585, 280, 30],
      [145, 382, 210, 144],
      [310, 252, 130, 112],
      [500, 247, 126, 178],
      [650, 337, 155, 180],
      [680, 510, 190, 80],
      [580, 390, 100, 64],
      [280, 530, 105, 60],
    ].forEach(([x, y, w, h]) => this.addWall(x, y, w, h));
  }

  createControlRoomNote() {
    const paper = this.add.container(380, 477, [
      this.add.rectangle(0, 0, 30, 22, 0xd8ccae).setStrokeStyle(2, 0x857754),
      this.add.rectangle(-3, -4, 12, 1, 0x8c8063),
      this.add.rectangle(2, 0, 18, 1, 0x8c8063),
      this.add.rectangle(-1, 4, 14, 1, 0x8c8063),
    ]).setAngle(-12).setDepth(2.8);
    this.controlRoomNote = paper;
    this.controlRoomNoteGlint = this.add.star(380, 465, 4, 2, 6, 0xffffff).setDepth(5);
    this.tweens.add({
      targets: this.controlRoomNoteGlint,
      alpha: .2,
      scale: .65,
      yoyo: true,
      repeat: -1,
      duration: 450,
    });
    paper.setVisible(false);
    this.controlRoomNoteGlint.setVisible(false);
  }

  createRestRoomSpareFuse() {
    const fuse = this.add.graphics().setPosition(620, 320).setDepth(3.2);
    fuse.fillStyle(0x26282a, 1);
    fuse.fillRoundedRect(-15, -7, 30, 14, 4);
    fuse.fillStyle(0xb9c0bd, 1);
    fuse.fillRect(-18, -5, 5, 10);
    fuse.fillRect(13, -5, 5, 10);
    fuse.fillStyle(0xdacb8b, 1);
    fuse.fillRoundedRect(-10, -5, 20, 10, 3);
    fuse.lineStyle(1, 0x55534a, 1);
    fuse.strokeRoundedRect(-10, -5, 20, 10, 3);
    this.restRoomSpareFuseSprite = fuse;
    fuse.setVisible(false);
    this.tweens.add({
      targets: fuse,
      alpha: .65,
      yoyo: true,
      repeat: -1,
      duration: 650,
    });
  }

  collectRestRoomSpareFuse() {
    if (!this.controlRoomLightsOff || this.restRoomSpareFuseCollected) return;
    this.restRoomSpareFuseCollected = true;
    this.restRoomSpareFuseSprite.setVisible(false);
    this.toast('Recogiste el fusible de repuesto.');
  }

  installRestRoomSpareFuse() {
    if (
      this.currentRoom !== 'sala-control'
      || !this.controlRoomLightsOff
      || this.patioDoorUnlocked
    ) return;
    if (!this.restRoomSpareFuseCollected) {
      this.toast('Necesitas el fusible de repuesto de la sala de descanso.');
      return;
    }

    this.restRoomSpareFuseCollected = false;
    this.controlRoomLightsOff = false;
    this.controlRoomFlashlightOn = false;
    this.patioDoorUnlocked = true;
    this.updateRoomObjects();
    this.toast('Instalaste el fusible. La luz volvió y la puerta del patio ya tiene energía.');
  }

  exitToPatio() {
    if (this.currentRoom !== 'pasillo') return;
    if (!this.patioDoorUnlocked) {
      this.toast('La puerta del patio no tiene energía.');
      return;
    }

    this.prepareBossArenaAmmo();
    this.currentRoom = 'patio';
    this.roomBackground.setVisible(false);
    this.patioBackground.setVisible(true);
    this.walls.clear(true, true);
    this.createPatioWalls();
    this.updateRoomObjects();
    this.setReceptionInteractables();
    this.player.setPosition(400, 535).setScale(.33);
    this.player.body.setVelocity(0, 0);
    this.facing = 'north';
    this.setPlayerIdle();
    this.toast('Saliste al patio. La arena del enfrentamiento está lista.');
  }

  returnFromPatio() {
    if (this.currentRoom !== 'patio') return;

    this.currentRoom = 'pasillo';
    this.roomBackground.setTexture('pasillo').setDisplaySize(800, 600).setVisible(true);
    this.patioBackground.setVisible(false);
    this.walls.clear(true, true);
    this.createHallwayWalls();
    this.updateRoomObjects();
    this.setReceptionInteractables();
    this.player.setPosition(400, 85).setScale(.33);
    this.player.body.setVelocity(0, 0);
    this.facing = 'south';
    this.setPlayerIdle();
    this.toast('Volviste al pasillo.');
  }

  createPatioBackground() {
    return this.add.image(400, 300, 'patio')
      .setDisplaySize(800, 600)
      .setDepth(.2)
      .setVisible(false);
  }

  createPatioWalls() {
    [
      [15, 300, 30, 600],
      [785, 300, 30, 600],
      [165, 145, 330, 80],
      [635, 145, 330, 80],
      [165, 585, 330, 30],
      [635, 585, 330, 30],
      [108, 192, 120, 110],
      [165, 340, 210, 135],
      [104, 468, 135, 125],
      [698, 255, 150, 230],
      [706, 460, 160, 140],
    ].forEach(([x, y, w, h]) => this.addWall(x, y, w, h));
    this.patioNorthBoundary = this.addWall(400, 15, 800, 30);
    if (this.patioGateUnlocked) {
      this.patioNorthBoundary.body.enable = false;
      this.patioNorthBoundary.setVisible(false);
    }
  }

  syncControlRoomLighting() {
    const blackoutActive = this.controlRoomLightsOff;
    this.controlRoomLightCanvas.classList.toggle('hidden', !blackoutActive);
    const showHint = blackoutActive && !this.controlRoomFlashlightOn;
    $('flashlight-hint').classList.toggle('hidden', !showHint);
  }

  syncMusic(force = false) {
    if (!this.musicTracks) return;

    const hasActiveZombie = (this.currentRoom === 'recepcion'
      && (this.zombieState === 'entering' || this.zombieState === 'alive'))
      || (this.currentRoom === 'celdas'
        && this.cellZombies.some((zombie) => zombie.state === 'alive'))
      || this.roomZombies.some((zombie) => (
        zombie.room === this.currentRoom && zombie.state === 'alive'
      ));
    const mode = this.currentRoom === 'patio'
      ? 'finalBoss'
      : this.patioDoorUnlocked ? 'normal' : hasActiveZombie ? 'zombie' : 'normal';
    if (!force && mode === this.currentMusicMode) return;

    Object.values(this.musicTracks).forEach((track) => track.stop());
    this.musicTracks[mode].play();
    this.currentMusicMode = mode;
  }

  activateControlRoomButton() {
    if (
      this.currentRoom !== 'sala-control'
      || this.controlRoomLightsOff
      || this.patioDoorUnlocked
    ) return;
    this.controlRoomLightsOff = true;
    this.spawnRoomZombies('sala-control', 3);
    this.syncControlRoomLighting();
    this.updateRoomObjects();
    this.toast('¡Se cortó la energía! Aparecieron más zombis; la lámpara los acelera.');
  }

  toggleControlRoomFlashlight() {
    if (!this.controlRoomLightsOff) return;
    this.controlRoomFlashlightOn = !this.controlRoomFlashlightOn;
    this.syncControlRoomLighting();
  }

  renderControlRoomLighting() {
    const context = this.controlRoomLightContext;
    const canvas = this.controlRoomLightCanvas;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgba(4, 5, 8, 0.84)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (!this.controlRoomFlashlightOn) return;

    const originX = this.player.x;
    const originY = this.player.y - 28;
    const angle = this.getFlashlightAngle(originX, originY);
    const radius = 245;
    const spread = Math.PI / 7.14;

    context.save();
    context.beginPath();
    context.moveTo(originX, originY);
    context.arc(originX, originY, radius, angle - spread, angle + spread);
    context.closePath();
    context.clip();
    const light = context.createRadialGradient(originX, originY, 20, originX, originY, radius);
    light.addColorStop(0, 'rgba(0, 0, 0, 1)');
    light.addColorStop(.8, 'rgba(0, 0, 0, .9)');
    light.addColorStop(1, 'rgba(0, 0, 0, 0)');
    context.globalCompositeOperation = 'destination-out';
    context.fillStyle = light;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
    context.globalCompositeOperation = 'source-over';
  }

  getFlashlightAngle(originX, originY) {
    const pointer = this.input.activePointer;
    return Math.atan2(pointer.worldY - originY, pointer.worldX - originX);
  }

  isPositionInFlashlight(x, y) {
    if (
      this.currentRoom !== 'sala-control'
      || !this.controlRoomLightsOff
      || !this.controlRoomFlashlightOn
    ) return false;

    const originX = this.player.x;
    const originY = this.player.y - 28;
    const dx = x - originX;
    const dy = y - originY;
    if (Math.hypot(dx, dy) > 245) return false;

    const angle = Math.atan2(dy, dx);
    const flashlightAngle = this.getFlashlightAngle(originX, originY);
    const difference = Math.atan2(
      Math.sin(angle - flashlightAngle),
      Math.cos(angle - flashlightAngle),
    );
    return Math.abs(difference) <= Math.PI / 7.14;
  }

  isBasementWalkable(x, y) {
    return this.basementWalkableAreas.some((area) => {
      let inside = false;
      for (let i = 0, j = area.length - 1; i < area.length; j = i, i += 1) {
        const [xi, yi] = area[i];
        const [xj, yj] = area[j];
        const intersects = (yi > y) !== (yj > y)
          && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersects) inside = !inside;
      }
      return inside;
    });
  }

  createBasementLockpick() {
    const icon = this.add.graphics().setPosition(165, 398).setDepth(3.2).setScale(.6);
    icon.lineStyle(7, 0x252a2d, 1);
    icon.beginPath();
    icon.moveTo(-26, 10);
    icon.lineTo(17, 0);
    icon.lineTo(22, -3);
    icon.lineTo(27, -10);
    icon.strokePath();
    icon.lineStyle(4, 0xd5d9d4, 1);
    icon.beginPath();
    icon.moveTo(-26, 10);
    icon.lineTo(17, 0);
    icon.lineTo(22, -3);
    icon.lineTo(27, -10);
    icon.strokePath();
    icon.lineStyle(6, 0x252a2d, 1);
    icon.beginPath();
    icon.moveTo(-18, -12);
    icon.lineTo(18, -12);
    icon.lineTo(18, -5);
    icon.lineTo(30, -5);
    icon.strokePath();
    icon.lineStyle(3, 0xe7bd68, 1);
    icon.beginPath();
    icon.moveTo(-18, -12);
    icon.lineTo(18, -12);
    icon.lineTo(18, -5);
    icon.lineTo(30, -5);
    icon.strokePath();
    this.basementLockpickSprite = icon;
    icon.setVisible(false);
    this.tweens.add({ targets: icon, alpha: .55, yoyo: true, repeat: -1, duration: 700 });
  }

  createRestRoomWalls() {
    [
      [18, 300, 36, 600],
      [782, 300, 36, 600],
      [400, 15, 800, 30],
      [185, 585, 370, 30],
      [615, 585, 370, 30],
      [400, 335, 260, 135],
      [601, 180, 90, 100],
      [720, 180, 130, 120],
      [730, 390, 85, 235],
      [125, 448, 120, 55],
      [90, 535, 160, 30],
    ].forEach(([x, y, w, h]) => this.addWall(x, y, w, h));
  }

  enterCells() {
    if (this.currentRoom !== 'pasillo') return;

    this.currentRoom = 'celdas';
    this.roomBackground.setTexture('celdas').setDisplaySize(800, 600);
    this.walls.clear(true, true);
    this.createCellWalls();
    this.updateRoomObjects();
    this.setReceptionInteractables();
    this.player.setPosition(480, 495);
    this.player.body.setVelocity(0, 0);
    this.facing = 'north';
    this.setPlayerIdle();
    this.toast('Entraste al área de celdas.');
  }

  returnToHallway() {
    if (this.currentRoom !== 'celdas') return;

    this.currentRoom = 'pasillo';
    this.roomBackground.setTexture('pasillo').setDisplaySize(800, 600);
    this.walls.clear(true, true);
    this.createHallwayWalls();
    this.updateRoomObjects();
    this.setReceptionInteractables();
    this.player.setPosition(535, 410);
    this.player.body.setVelocity(0, 0);
    this.facing = 'west';
    this.setPlayerIdle();
    this.toast('Volviste al pasillo.');
  }

  wakeCellZombie(index) {
    const zombie = this.cellZombies[index];
    if (!zombie || zombie.state !== 'sleeping') return false;
    zombie.state = 'alive';
    zombie.sprite.setTexture(`zombie-${zombie.variant.id}`, `${zombie.variant.id}-1`)
      .setScale(.33)
      .setDepth(3)
      .setVisible(this.currentRoom === 'celdas');
    zombie.sprite.body.enable = this.currentRoom === 'celdas';
    zombie.sprite.play(`walk-zombie-${zombie.variant.id}`, true);
    return true;
  }

  openAllCellDoors() {
    const closedDoors = this.cellDoorStates
      .map((state, index) => state === 'closed' ? index : -1)
      .filter((index) => index >= 0);
    if (closedDoors.length === 0) return;

    closedDoors.forEach((index) => { this.cellDoorStates[index] = 'opening'; });
    this.tweens.addCounter({
      from: 0,
      to: 3,
      duration: 900,
      onUpdate: (tween) => {
        const frame = Math.floor(tween.getValue());
        closedDoors.forEach((index) => this.cellDoors[index].setTexture(`cell-door-${frame}`));
      },
      onComplete: () => {
        let wokeZombie = false;
        closedDoors.forEach((index) => {
          this.cellDoorStates[index] = 'open';
          this.cellDoors[index].setTexture('cell-door-3');
          this.cellDoorBlockers[index].body.enable = false;
          this.cellDoorBlockers[index].setVisible(false);
          wokeZombie = this.wakeCellZombie(index) || wokeZombie;
        });
        this.updateRoomObjects();
        if (wokeZombie) {
          this.toast('El computador abrió las celdas. Busca la llave de la sala de descanso.');
        }
      },
    });
  }

  openEntryDoor() {
    if (!this.entryDoor) return;
    const { opening, leaf } = this.entryDoor;
    this.entryDoorState = 'opening';
    opening.setVisible(true);
    leaf.setVisible(true);
    this.tweenDoor(-90, () => {
      this.entryDoorState = 'open';
      if (this.currentRoom === 'recepcion' && this.doorBlocker?.body) {
        this.doorBlocker.body.enable = false;
        this.doorBlocker.setVisible(false);
      }
      if (!this.zombie) {
        this.toast('La puerta está abierta.');
        return;
      }

      this.zombieState = 'entering';
      this.zombie.body.enable = true;
      this.zombie.setAlpha(1).setDepth(3.5);
      this.zombie.play(`walk-zombie-${this.zombieVariant.id}`, true);
      this.toast('¡Un zombi abrió la puerta y entró!');
      this.tweens.add({
        targets: this.zombie,
        y: 205,
        duration: 1200,
        ease: 'Linear',
        onComplete: () => {
          this.zombie.stop();
          this.entryDoorState = 'closing';
          this.tweenDoor(0, () => {
            this.entryDoorState = 'closed';
            opening.setVisible(false);
            leaf.setVisible(false);
            if (this.currentRoom === 'recepcion' && this.doorBlocker?.body) {
              this.doorBlocker.setVisible(true);
              this.doorBlocker.body.enable = true;
            }
            this.zombieState = 'alive';
          });
        },
      });
    });
  }

  updateAimDirection(pointer) {
    const angle = Phaser.Math.Angle.Normalize(
      Phaser.Math.Angle.Between(this.player.x, this.player.y, pointer.worldX, pointer.worldY),
    );
    const index = Phaser.Math.Wrap(Math.round(angle / (Math.PI / 4)), 0, MOVEMENT_DIRECTIONS.length);
    this.aimDirection = MOVEMENT_DIRECTIONS[index];
    this.facing = this.aimDirection;
    this.setAimSprite();
  }

  setPlayerIdle() {
    const facing = this.facing || 'south';
    this.player.stop();
    this.player.setTexture('player', `${facing}-${facing === 'east' ? 1 : 0}`);
    this.player.setFlipX(false);
  }

  setAimSprite() {
    if (!this.weapon || !this.aiming) return;
    this.player.stop();
    if (this.weapon === 'escopeta') {
      this.player.setTexture('weapon-shotgun', `frame-${SHOTGUN_AIM_FRAMES[this.aimDirection]}`);
      this.player.setFlipX(false);
      return;
    }
    this.player.setTexture(`weapon-${this.weapon === 'bate' ? 'bat' : 'pistol'}`, `${this.aimDirection}-${WEAPON_AIM_FRAME}`);
  }

  attack(direction = this.aimDirection) {
    if (!this.playerAlive || !this.weapon || !this.aiming || this.ui || this.attackInProgress) return;
    this.facing = direction;
    const type = this.weapon === 'bate' ? 'bat' : this.weapon === 'escopeta' ? 'shotgun' : 'pistol';
    const animationDirection = this.weapon === 'escopeta'
      ? ['south', 'southeast', 'southwest'].includes(direction) ? 'south'
        : ['east', 'northeast'].includes(direction) ? 'east'
          : ['west', 'northwest'].includes(direction) ? 'west' : 'north'
      : direction;
    const animationKey = `attack-${type}-${animationDirection}`;
    if (!this.anims.exists(animationKey)) return;
    if (this.weapon !== 'bate') {
      if (this.ammo[this.weapon] <= 0) {
        this.toast(`No te quedan ${this.weapon === 'pistola' ? 'balas' : 'cartuchos'}. Busca munición.`);
        return;
      }
      this.ammo[this.weapon] -= 1;
      this.refresh();
    }

    this.attackInProgress = true;
    if (this.weaponSounds[this.weapon]) this.weaponSounds[this.weapon].play();
    this.player.play(animationKey);
    const hitDelay = this.weapon === 'bate' ? 250 : this.weapon === 'escopeta' ? 100 : 150;
    this.time.delayedCall(hitDelay, () => this.tryHitZombie(direction));
    this.attackAnimationCompleteHandler = () => {
      this.attackAnimationCompleteHandler = null;
      this.attackInProgress = false;
      if (this.aiming) this.setAimSprite();
      else this.setPlayerIdle();
    };
    this.player.once('animationcomplete', this.attackAnimationCompleteHandler);
  }

  grantStartingAmmo(weapon) {
    if (!STARTING_AMMO[weapon] || this.firearmsAcquired.has(weapon)) return;
    this.ammo[weapon] += STARTING_AMMO[weapon];
    this.firearmsAcquired.add(weapon);
    this.refresh();
  }

  spawnZombie() {
    if (this.zombieSpawned) return;
    this.zombieSpawned = true;
    this.zombieState = 'entering';
    this.zombieVariant = Phaser.Utils.Array.GetRandom(ZOMBIE_VARIANTS);
    this.zombieHealth = this.zombieVariant.health;
    this.zombieStunnedUntil = 0;
    this.zombie = this.physics.add.sprite(
      144, 12, `zombie-${this.zombieVariant.id}`, `${this.zombieVariant.id}-1`,
    )
      .setOrigin(.5, .9)
      .setScale(.33)
      .setAlpha(0)
      .setDepth(2.5);
    this.zombie.body.setSize(60, 40).setOffset(114, 150);
    this.zombie.body.setCollideWorldBounds(true);
    this.zombie.body.enable = false;
    this.physics.add.collider(this.zombie, this.walls);
    this.physics.add.collider(this.zombie, this.player);
    this.openEntryDoor();
  }

  spawnRoomEncounter(room) {
    if (this.spawnedRoomEncounters.has(room)) return;
    this.spawnedRoomEncounters.add(room);
    this.spawnRoomZombies(room, 1);
  }

  spawnRoomZombies(room, count) {
    const spawnPoints = ROOM_ZOMBIE_SPAWN_POINTS[room];
    if (!spawnPoints?.length) return;

    const candidates = Phaser.Utils.Array.Shuffle(spawnPoints.map(([x, y]) => ({ x, y })));
    const availablePoints = candidates.filter(({ x, y }) => {
      const tooCloseToResource = [
        ...this.healingItems.filter((item) => item.room === room),
        ...this.ammoItems.filter((item) => item.room === room),
      ].some((item) => Phaser.Math.Distance.Between(x, y, item.x, item.y) < 60);
      const bounds = new Phaser.Geom.Rectangle(x - 24, y - 28, 48, 42);
      const overlapsWall = this.walls.getChildren().some((wall) => (
        wall.body?.enable && Phaser.Geom.Rectangle.Overlaps(bounds, wall.body)
      ));
      const tooCloseToZombie = this.roomZombies.some((zombie) => (
        zombie.room === room
        && Phaser.Math.Distance.Between(x, y, zombie.sprite.x, zombie.sprite.y) < 70
      ));
      return !tooCloseToResource && !overlapsWall
        && !tooCloseToZombie
        && (room !== 'sotano' || this.isBasementWalkable(x, y))
        && Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y) > 130;
    });
    if (availablePoints.length < count) {
      throw new Error(`No hay suficientes puntos libres para los zombis de ${room}.`);
    }

    availablePoints.slice(0, count).forEach((spawnPoint) => {
      const variant = Phaser.Utils.Array.GetRandom(ZOMBIE_VARIANTS);
      const sprite = this.physics.add.sprite(
        spawnPoint.x,
        spawnPoint.y,
        `zombie-${variant.id}`,
        `${variant.id}-1`,
      )
        .setOrigin(.5, .9)
        .setScale(.33)
        .setDepth(2.5);
      sprite.body.setSize(60, 40).setOffset(114, 150);
      sprite.body.setCollideWorldBounds(true);
      this.physics.add.collider(sprite, this.walls);
      this.physics.add.collider(sprite, this.player);
      this.roomZombies.push({
        sprite,
        variant,
        room,
        health: variant.health,
        state: 'alive',
        stunnedUntil: 0,
        knockbackUntil: 0,
      });
    });
  }

  tryHitZombie(direction) {
    if (this.currentRoom === 'patio') {
      this.tryHitFinalBoss(direction);
      return;
    }

    const targets = this.currentRoom === 'celdas'
      ? this.cellZombies.filter((zombie) => zombie.state === 'alive').map((zombie) => ({
        sprite: zombie.sprite,
        variant: zombie.variant,
        cellZombie: zombie,
      }))
      : [
        ...(this.zombieState === 'alive' && this.zombie
          ? [{ sprite: this.zombie, variant: this.zombieVariant, cellZombie: null }]
          : []),
        ...this.roomZombies
          .filter((zombie) => zombie.room === this.currentRoom && zombie.state === 'alive')
          .map((roomZombie) => ({
            sprite: roomZombie.sprite,
            variant: roomZombie.variant,
            cellZombie: null,
            roomZombie,
          })),
      ];
    if (targets.length === 0) return;

    const attackAngle = MOVEMENT_DIRECTIONS.indexOf(direction) * Math.PI / 4;
    const weapon = WEAPONS[this.weapon];
    const inAttackArea = targets
      .map((candidate) => {
        const dx = candidate.sprite.x - this.player.x;
        const dy = candidate.sprite.y - this.player.y;
        const distance = Math.hypot(dx, dy);
        const angleDifference = Math.abs(Phaser.Math.Angle.Wrap(Math.atan2(dy, dx) - attackAngle));
        return { ...candidate, dx, dy, distance, angleDifference };
      })
      .filter((candidate) => candidate.distance <= weapon.range
        && candidate.angleDifference <= (this.weapon === 'bate' ? BAT_SWING_ARC : Math.PI / 4))
      .sort((a, b) => a.distance - b.distance);
    const hitTargets = this.weapon === 'bate' ? inAttackArea : inAttackArea.slice(0, 1);
    if (hitTargets.length === 0) {
      this.toast('El ataque no alcanzó al zombi.');
      return;
    }

    const results = hitTargets.map((target) => this.hitZombieTarget(target, weapon));
    const hits = results.filter((result) => result.hit);
    if (hits.length === 0) {
      const closestChance = results[0].hitChance;
      this.toast(`Fallaste. Probabilidad de acierto: ${Math.round(closestChance)} %.`);
      return;
    }

    const damageTotal = hits.reduce((total, result) => total + result.damage, 0);
    const criticalHits = hits.filter((result) => result.criticalHit).length;
    this.toast(
      `${this.weapon === 'bate' && hits.length > 1 ? `¡Golpe de área! ${hits.length} zombis alcanzados. ` : ''}`
      + `${criticalHits ? `¡CRÍTICO${criticalHits > 1 ? 's' : ''}! ` : ''}`
      + `Daño total: ${damageTotal} PV.`,
    );
  }

  tryHitFinalBoss(direction) {
    if (this.finalBossDefeated) return;
    const explosiveThreshold = FINAL_BOSS_MAX_HEALTH * FINAL_BOSS_EXPLOSIVE_THRESHOLD;
    if (this.finalBossHealth <= explosiveThreshold) {
      this.toast('El jefe está debilitado. Usa el barril explosivo.');
      return;
    }

    const dx = this.finalBoss.x - this.player.x;
    const dy = this.finalBoss.y - 35 - this.player.y;
    const distance = Math.hypot(dx, dy);
    const attackAngle = MOVEMENT_DIRECTIONS.indexOf(direction) * Math.PI / 4;
    const angleDifference = Math.abs(Phaser.Math.Angle.Wrap(Math.atan2(dy, dx) - attackAngle));
    const weapon = WEAPONS[this.weapon];
    if (
      distance > weapon.range
      || angleDifference > (this.weapon === 'bate' ? BAT_SWING_ARC : Math.PI / 4)
    ) {
      this.toast('El ataque no alcanzó al jefe.');
      return;
    }

    const distanceProgress = Phaser.Math.Clamp(
      (distance - weapon.accuracyNearDistance) / (weapon.range - weapon.accuracyNearDistance),
      0,
      1,
    );
    const hitChance = Phaser.Math.Linear(weapon.accuracyNear, weapon.accuracyFar, distanceProgress);
    if (Phaser.Math.Between(1, 100) > hitChance) {
      this.toast(`Fallaste. Probabilidad de acierto: ${Math.round(hitChance)} %.`);
      return;
    }

    const criticalHit = Phaser.Math.Between(1, 100) <= weapon.criticalChance;
    const baseDamage = Phaser.Math.Linear(weapon.damage, weapon.damageFar ?? weapon.damage, distanceProgress);
    const damage = criticalHit ? (weapon.criticalDamage ?? weapon.damage * 2) : Math.round(baseDamage);
    this.finalBossHealth = Math.max(explosiveThreshold, this.finalBossHealth - damage);
    this.finalBoss.setTintFill(0xffffff);
    this.time.delayedCall(100, () => {
      if (this.finalBoss.active && !this.finalBossDefeated) this.finalBoss.clearTint();
    });
    this.updateFinalBossHud();

    if (this.finalBossHealth <= explosiveThreshold) {
      this.finalBossExplosive.setVisible(true);
      this.toast('¡El jefe está al 40 %! Acércate al barril brillante y presiona E.');
      return;
    }
    this.toast(`${criticalHit ? '¡CRÍTICO! ' : ''}Le hiciste ${damage} PV al jefe.`);
  }

  hitZombieTarget(target, weapon) {
    const { sprite, variant, cellZombie, dx, dy, distance } = target;
    const roomZombie = target.roomZombie ?? null;
    const distanceProgress = Phaser.Math.Clamp(
      (distance - weapon.accuracyNearDistance) / (weapon.range - weapon.accuracyNearDistance),
      0,
      1,
    );
    const hitChance = Phaser.Math.Linear(weapon.accuracyNear, weapon.accuracyFar, distanceProgress);
    if (Phaser.Math.Between(1, 100) > hitChance) return { hit: false, hitChance };

    const criticalHit = Phaser.Math.Between(1, 100) <= weapon.criticalChance;
    const baseDamage = Phaser.Math.Linear(weapon.damage, weapon.damageFar ?? weapon.damage, distanceProgress);
    const damage = criticalHit ? (weapon.criticalDamage ?? weapon.damage * 2) : Math.round(baseDamage);
    const health = cellZombie ? cellZombie.health : roomZombie ? roomZombie.health : this.zombieHealth;
    const remainingHealth = Math.max(0, health - damage);
    if (cellZombie) cellZombie.health = remainingHealth;
    else if (roomZombie) roomZombie.health = remainingHealth;
    else this.zombieHealth = remainingHealth;
    sprite.setTintFill(0xffffff);
    this.time.delayedCall(90, () => {
      const alive = cellZombie
        ? cellZombie.state === 'alive'
        : roomZombie ? roomZombie.state === 'alive' : this.zombieState === 'alive';
      if (sprite.active && alive) sprite.clearTint();
    });

    if (this.weapon === 'bate' && remainingHealth > 0) {
      const direction = new Phaser.Math.Vector2(dx, dy).normalize();
      sprite.body.setVelocity(
        direction.x * BAT_KNOCKBACK_SPEED,
        direction.y * BAT_KNOCKBACK_SPEED,
      );
      if (cellZombie) cellZombie.knockbackUntil = this.time.now + BAT_KNOCKBACK_DURATION;
      else if (roomZombie) roomZombie.knockbackUntil = this.time.now + BAT_KNOCKBACK_DURATION;
      else this.zombieKnockbackUntil = this.time.now + BAT_KNOCKBACK_DURATION;
    }

    if (criticalHit) {
      if (cellZombie) cellZombie.stunnedUntil = this.time.now + ZOMBIE_STUN_DURATION;
      else if (roomZombie) roomZombie.stunnedUntil = this.time.now + ZOMBIE_STUN_DURATION;
      else this.zombieStunnedUntil = this.time.now + ZOMBIE_STUN_DURATION;
      sprite.stop();
    }
    if (remainingHealth > 0) return { hit: true, damage, criticalHit };

    if (cellZombie) cellZombie.state = 'dead';
    else if (roomZombie) roomZombie.state = 'dead';
    else this.zombieState = 'dead';
    sprite.body.enable = false;
    sprite.stop();
    sprite.clearTint();
    sprite.setTexture(`zombie-${variant.id}`, `${variant.id}-dead`)
      .setAngle(0)
      .setScale(.33)
      .setAlpha(1)
      .setFlipX(false)
      .setDepth(1);
    return { hit: true, damage, criticalHit };
  }

  updateZombie(delta) {
    if (this.currentRoom === 'recepcion' && this.zombieState === 'alive' && this.zombie?.body) {
      this.updateZombieChase(
        this.zombie,
        this.zombieVariant,
        this.zombieStunnedUntil,
        this.player.x,
        this.player.y,
        true,
        this.zombieKnockbackUntil,
      );
    } else if (this.currentRoom === 'celdas') {
      this.cellZombies.forEach((zombie) => {
        if (zombie.state === 'alive' && zombie.sprite.body?.enable) {
          const doorY = [140, 300, 480][zombie.cellIndex];
          const hasLeftCell = zombie.sprite.x >= 374;
          this.updateZombieChase(
            zombie.sprite,
            zombie.variant,
            zombie.stunnedUntil,
            hasLeftCell ? this.player.x : 430,
            hasLeftCell ? this.player.y : doorY,
            hasLeftCell,
            zombie.knockbackUntil,
          );
        }
      });
    }

    this.roomZombies.forEach((zombie) => {
      if (zombie.room === this.currentRoom && zombie.state === 'alive' && zombie.sprite.body?.enable) {
        this.updateZombieChase(
          zombie.sprite,
          zombie.variant,
          zombie.stunnedUntil,
          this.player.x,
          this.player.y,
          true,
          zombie.knockbackUntil,
        );
        if (zombie.room === 'sotano') {
          const velocity = zombie.sprite.body.velocity;
          const step = Math.min(delta / 1000, .05);
          const nextX = zombie.sprite.x + velocity.x * step;
          const nextY = zombie.sprite.y + velocity.y * step;
          if (!this.isBasementWalkable(nextX, nextY)) {
            const canMoveX = this.isBasementWalkable(nextX, zombie.sprite.y);
            const canMoveY = this.isBasementWalkable(zombie.sprite.x, nextY);
            zombie.sprite.body.setVelocity(canMoveX ? velocity.x : 0, canMoveY ? velocity.y : 0);
          }
        }
      }
    });
  }

  updateFinalBoss() {
    if (this.currentRoom !== 'patio' || !this.finalBoss?.body.enable) return;

    const dx = this.player.x - this.finalBoss.x;
    const dy = this.player.y - this.finalBoss.y;
    const distance = Math.hypot(dx, dy);
    const row = Math.abs(dx) > Math.abs(dy)
      ? dx < 0 ? 2 : 3
      : dy < 0 ? 1 : 0;
    this.finalBoss.setDepth(2.5 + this.finalBoss.y / 600);

    if (this.finalBossAttacking) {
      this.finalBoss.body.setVelocity(0, 0);
      return;
    }

    if (distance <= FINAL_BOSS_ATTACK_RANGE) {
      this.finalBoss.body.setVelocity(0, 0);
      this.finalBoss.stop();
      if (this.time.now >= this.finalBossNextAttackAt) {
        this.finalBossAttacking = true;
        this.finalBossNextAttackAt = this.time.now + FINAL_BOSS_ATTACK_COOLDOWN;
        this.finalBossAttackCount += 1;
        const strongAttack = this.finalBossAttackCount % 3 === 0;
        const damage = strongAttack ? FINAL_BOSS_STRONG_DAMAGE : FINAL_BOSS_NORMAL_DAMAGE;
        const attackName = strongAttack ? 'golpe fuerte' : 'golpe';
        this.finalBoss.play(
          `final-boss-${strongAttack ? 'strong-' : ''}attack-${row}`,
        );
        this.time.delayedCall(380, () => {
          if (this.currentRoom !== 'patio' || !this.playerAlive) return;
          if (Phaser.Math.Distance.Between(
            this.finalBoss.x,
            this.finalBoss.y,
            this.player.x,
            this.player.y,
          ) > FINAL_BOSS_ATTACK_RANGE + 25) return;
          this.toast(`El jefe conecta un ${attackName}: ${damage} PV. Invulnerable para la prueba.`);
          this.applyPlayerDamage(damage);
        });
        this.finalBoss.once('animationcomplete', () => {
          this.finalBossAttacking = false;
        });
      } else {
        this.finalBoss.setTexture('final-boss', `walk-${row}-0`);
      }
      return;
    }

    const velocity = new Phaser.Math.Vector2(dx, dy).normalize().scale(FINAL_BOSS_SPEED);
    this.finalBoss.body.setVelocity(velocity.x, velocity.y);
    this.finalBoss.play(`final-boss-walk-${row}`, true);
  }

  updateZombieChase(
    sprite,
    variant,
    stunnedUntil,
    targetX = this.player.x,
    targetY = this.player.y,
    canAttack = true,
    knockbackUntil = 0,
  ) {
    if (this.time.now < knockbackUntil) return;
    if (this.time.now < stunnedUntil) {
      sprite.body.setVelocity(0, 0);
      return;
    }

    const dx = targetX - sprite.x;
    const dy = targetY - sprite.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 38) {
      sprite.body.setVelocity(0, 0);
      if (canAttack) this.damagePlayerFromZombie(variant);
      return;
    }

    const flashlightSpeedFactor = this.isPositionInFlashlight(sprite.x, sprite.y)
      ? ZOMBIE_FLASHLIGHT_SPEED_FACTOR
      : 1;
    const velocity = new Phaser.Math.Vector2(dx, dy).normalize().scale(
      this.getPlayerSpeed() * ZOMBIE_SPEED_FACTOR * flashlightSpeedFactor,
    );
    sprite.body.setVelocity(velocity.x, velocity.y);
    sprite.setFlipX(dx < 0);
    sprite.play(`walk-zombie-${variant.id}`, true);
  }

  damagePlayerFromZombie(variant) {
    const now = this.time.now;
    if (!this.playerAlive || now - this.lastZombieAttackAt < ZOMBIE_ATTACK_COOLDOWN) return;
    this.lastZombieAttackAt = now;
    const damage = variant.id === 'bulky'
      ? ZOMBIE_CONTACT_DAMAGE.bulky
      : ZOMBIE_CONTACT_DAMAGE.normal;
    this.applyPlayerDamage(damage, `¡Te atacó el zombi! -${damage} PV.`);
  }

  collectRestRoomKey() {
    if (this.restRoomKeyCollected || this.cellDoorStates[2] !== 'open') return;
    this.restRoomKeyCollected = true;
    this.keyGlow.setVisible(false);
    this.keySprite.setVisible(false);
    this.keyGlint.setVisible(false);
    this.toast('Obtuviste la llave de la sala de descanso.');
  }

  collectBasementLockpick() {
    if (this.basementLockpickCollected || this.currentRoom !== 'descanso') return;
    this.basementLockpickCollected = true;
    this.basementLockpickSprite.setVisible(false);
    this.toast('Encontraste una ganzúa sobre el escritorio.');
  }

  collectHealingItem(id) {
    const item = this.healingItems.find((healingItem) => healingItem.id === id);
    const collectible = this.healingSprites.find((healingItem) => healingItem.id === id);
    if (!item || !collectible?.sprite.visible) return;
    if (this.playerHealth === PLAYER_MAX_HEALTH) {
      this.toast('Ya tienes toda la vida.');
      return;
    }

    const restored = Math.min(item.health, PLAYER_MAX_HEALTH - this.playerHealth);
    this.playerHealth += restored;
    this.collectedHealingItems.add(id);
    collectible.sprite.setVisible(false);
    this.updateHealthHud();
    this.toast(`Usaste ${item.name}: +${restored} PV.`);
  }

  collectAmmoPickup(id) {
    const item = this.ammoItems.find((ammoItem) => ammoItem.id === id);
    const collectible = this.ammoSprites.find((ammoItem) => ammoItem.id === id);
    if (!item || !collectible?.sprite.visible || this.collectedAmmoItems.has(id)) return;
    this.ammo[item.weapon] += item.amount;
    this.collectedAmmoItems.add(id);
    collectible.sprite.setVisible(false);
    this.refresh();
    const ammoName = item.weapon === 'pistola' ? 'balas de pistola' : 'cartuchos de escopeta';
    this.toast(`Recogiste ${item.amount} ${ammoName}.`);
  }

  applyPlayerDamage(damage, message = `Recibiste ${damage} PV de daño.`) {
    if (PLAYER_INVULNERABLE || !this.playerAlive) return;
    this.playerHealth = Math.max(0, this.playerHealth - damage);
    this.updateHealthHud();
    this.toast(message);

    if (this.playerHealth === 0) {
      this.playerAlive = false;
      this.player.body.setVelocity(0, 0);
      this.aiming = false;
      this.attackInProgress = false;
      this.player.stop();
      $('game-ui').classList.add('hidden');
      $('game-over').classList.remove('hidden');
      this.scene.pause();
    }
  }

  getPlayerSpeed() {
    const healthRatio = this.playerHealth / PLAYER_MAX_HEALTH;
    const slowdownProgress = Phaser.Math.Clamp((1 - healthRatio) / .7, 0, 1);
    const healthSpeedFactor = 1 - slowdownProgress * .5;
    return PLAYER_BASE_SPEED * healthSpeedFactor;
  }

  updateHealthHud() {
    const ratio = this.playerHealth / PLAYER_MAX_HEALTH;
    $('health-value').textContent = `${this.playerHealth} / ${PLAYER_MAX_HEALTH}`;
    $('health-bar').style.width = `${ratio * 100}%`;
    const color = ratio >= .7 ? '#4f9b52' : ratio >= .4 ? '#df8b32' : '#b3201f';
    $('health-bar').style.backgroundColor = color;
  }

  addWall(x, y, w, h) {
    const r = this.add.rectangle(x, y, w, h, 0xff0000, DEBUG_COLLIDERS ? .3 : 0).setDepth(10);
    this.walls.add(r);
    return r;
  }

  updateRoomObjects() {
    const inReception = this.currentRoom === 'recepcion';
    const inCells = this.currentRoom === 'celdas';
    const inRestRoom = this.currentRoom === 'descanso';
    const inControlRoom = this.currentRoom === 'sala-control';

    this.noteGlint.setVisible(inReception && !this.noteRead);
    this.restNoteGlint.setVisible(inRestRoom && !this.restNoteRead);
    this.controlRoomNote.setVisible(inControlRoom);
    this.controlRoomNoteGlint.setVisible(inControlRoom && !this.controlRoomNoteRead);
    this.syncControlRoomLighting();
    this.basementLockpickSprite.setVisible(inRestRoom && !this.basementLockpickCollected);
    this.restRoomSpareFuseSprite.setVisible(
      inRestRoom && this.controlRoomLightsOff && !this.restRoomSpareFuseCollected,
    );
    this.corpseSprite.setVisible(inReception && this.corpse.length > 0);
    this.itemPistola.setVisible(inReception && this.corpse.includes('pistola'));
    this.itemBate.setVisible(inReception && this.corpse.includes('bate'));
    this.restRoomWeaponSprite?.setVisible(inRestRoom && !!this.restRoomWeapon);
    this.healingSprites.forEach(({ id, sprite }) => {
      const item = this.healingItems.find((healingItem) => healingItem.id === id);
      sprite.setVisible(item.room === this.currentRoom && !this.collectedHealingItems.has(id));
    });
    this.ammoSprites.forEach(({ id, sprite }) => {
      const item = this.ammoItems.find((ammoItem) => ammoItem.id === id);
      sprite.setVisible(item.room === this.currentRoom && !this.collectedAmmoItems.has(id));
    });

    this.entryDoor.opening.setVisible(inReception && this.entryDoorState === 'opening');
    this.entryDoor.leaf
      .setAngle(this.entryDoorState === 'open' || this.entryDoorState === 'opening' ? -90 : 0)
      .setVisible(inReception && this.entryDoorState === 'opening');

    this.cellDoors.forEach((door, index) => {
      door.setTexture(`cell-door-${this.cellDoorStates[index] === 'open' ? 3 : 0}`)
        .setVisible(inCells);
    });
    this.cellZombies.forEach((zombie) => {
      zombie.sprite.setVisible(inCells);
      zombie.sprite.body.enable = inCells && zombie.state === 'alive';
      if (zombie.state === 'sleeping') {
        zombie.sprite.setDepth(2.6).setAngle(0);
      }
    });
    const showKey = inCells && !this.restRoomKeyCollected;
    this.keyGlow.setVisible(showKey);
    this.keySprite.setVisible(showKey);
    this.keyGlint.setVisible(showKey);

    if (this.zombie) {
      const zombieInReception = inReception && this.zombieState !== 'absent';
      this.zombie.setVisible(zombieInReception);
      this.zombie.body.enable = zombieInReception
        && (this.zombieState === 'entering' || this.zombieState === 'alive');
    }
    if (this.finalBoss) {
      const bossInPatio = this.currentRoom === 'patio';
      this.finalBoss.setVisible(bossInPatio && !this.finalBossDefeated);
      this.finalBoss.body.enable = bossInPatio && !this.finalBossDefeated;
      if (!bossInPatio) this.finalBoss.body.setVelocity(0, 0);
    }
    this.finalBossExplosive?.setVisible(
      this.currentRoom === 'patio'
      && !this.finalBossExplosiveUsed
      && this.finalBossHealth <= FINAL_BOSS_MAX_HEALTH * FINAL_BOSS_EXPLOSIVE_THRESHOLD,
    );
    const showFinalBossKey = this.currentRoom === 'patio'
      && this.finalBossDefeated
      && !this.finalBossKeyCollected;
    this.finalBossKeySprite?.setVisible(showFinalBossKey);
    this.finalBossKeyGlint?.setVisible(showFinalBossKey);
    this.patioGateOpenVisual?.setVisible(this.currentRoom === 'patio' && this.patioGateUnlocked);
    this.roomZombies.forEach((zombie) => {
      const zombieInRoom = zombie.room === this.currentRoom;
      zombie.sprite.setVisible(zombieInRoom);
      zombie.sprite.body.enable = zombieInRoom && zombie.state === 'alive';
      if (!zombieInRoom) zombie.sprite.body.setVelocity(0, 0);
    });
    this.updateFinalBossHud();
  }

  setRestRoomWeaponSprite() {
    if (this.restRoomWeaponSprite) {
      this.tweens.killTweensOf(this.restRoomWeaponSprite);
      this.restRoomWeaponSprite.destroy();
      this.restRoomWeaponSprite = null;
    }
    if (!this.restRoomWeapon) return;

    if (this.restRoomWeapon === 'escopeta') {
      this.restRoomWeaponSprite = this.add.sprite(550, 270, 'weapon-shotgun', 'frame-0')
        .setOrigin(.5, .8)
        .setScale(.18)
        .setDepth(1);
    } else {
      const isBat = this.restRoomWeapon === 'bate';
      this.restRoomWeaponSprite = this.add.rectangle(
        550, 270, isBat ? 30 : 14, 6, isBat ? 0x6b4426 : 0x1c1c20,
      ).setStrokeStyle(1, isBat ? 0x2a1809 : 0x7a7a80).setDepth(1);
    }
    this.tweens.add({
      targets: this.restRoomWeaponSprite,
      alpha: .55,
      yoyo: true,
      repeat: -1,
      duration: 800,
    });
    this.restRoomWeaponSprite.setVisible(this.currentRoom === 'descanso');
  }

  createReceptionWalls() {
    [
      [50, 60, 100, 122],
      [400, 60, 424, 122],
      [750, 60, 100, 122],
      [17, 300, 34, 600],
      [783, 300, 34, 600],
      [141, 582, 282, 38],
      [660, 582, 282, 38],
      [400, 582, 236, 38],
      [248, 145, 52, 104],
      [538, 145, 58, 104],
      [400, 204, 330, 42],
      [424, 143, 38, 42],
      [333, 145, 34, 42],
      [48, 278, 42, 105],
      [752, 278, 42, 105],
      [752, 438, 42, 148],
      [48, 428, 48, 76],
      [44, 558, 40, 40],
      [756, 556, 40, 42],
      [217, 580, 40, 40],
      [583, 580, 40, 40],
    ].forEach(([x, y, w, h]) => this.addWall(x, y, w, h));

    this.doorBlocker = this.addWall(144, 60, 88, 122);
    if (this.entryDoorState !== 'locked') {
      this.doorBlocker.body.enable = false;
      this.doorBlocker.setVisible(false);
    }

    this.restRoomDoorBlocker = this.addWall(656, 60, 88, 122);
    if (this.restRoomKeyCollected) {
      this.restRoomDoorBlocker.body.enable = false;
      this.restRoomDoorBlocker.setVisible(false);
    }
  }

  createHallwayWalls() {
    [
      [230, 300, 30, 600],
      [570, 180, 30, 360],
      [570, 530, 30, 140],
      [150, 10, 300, 20],
      [650, 10, 300, 20],
      [400, 590, 400, 20],
      [285, 332, 70, 235],
      [543, 168, 48, 68],
      [543, 300, 48, 66],
      [543, 492, 48, 72],
    ].forEach(([x, y, w, h]) => this.addWall(x, y, w, h));
    this.patioExitBlocker = this.addWall(400, 35, 100, 50);
    if (this.patioDoorUnlocked) {
      this.patioExitBlocker.body.enable = false;
      this.patioExitBlocker.setVisible(false);
    }
  }

  createCellWalls() {
    [
      [20, 300, 40, 600],
      [780, 300, 40, 600],
      [400, 20, 800, 40],
      [225, 580, 370, 40],
      [650, 580, 300, 40],
      [190, 200, 320, 24],
      [190, 380, 320, 24],
      [190, 550, 320, 24],
      [356, 70, 20, 80],
      [356, 220, 20, 100],
      [356, 390, 20, 120],
      [356, 555, 20, 90],
      [107, 111, 130, 77],
      [235, 82, 50, 42],
      [107, 292, 130, 77],
      [235, 263, 50, 42],
      [107, 470, 130, 77],
      [235, 440, 50, 42],
      [680, 125, 155, 74],
      [674, 207, 48, 40],
      [755, 355, 54, 142],
      [755, 520, 54, 112],
    ].forEach(([x, y, w, h]) => this.addWall(x, y, w, h));
    this.cellDoorBlockers = [140, 300, 480].map((y, index) => {
      const blocker = this.addWall(356, y, 20, 60);
      if (this.cellDoorStates[index] === 'open') {
        blocker.body.enable = false;
        blocker.setVisible(false);
      }
      return blocker;
    });
  }

  setReceptionInteractables() {
    this.interactables = [
      {
        x: FINAL_BOSS_BARREL_POSITION.x, y: FINAL_BOSS_BARREL_POSITION.y, r: 56,
        available: () => this.currentRoom === 'patio'
          && !this.finalBossExplosiveUsed
          && this.finalBossHealth <= FINAL_BOSS_MAX_HEALTH * FINAL_BOSS_EXPLOSIVE_THRESHOLD,
        text: () => 'Lanzar el barril al jefe',
        action: () => this.useFinalBossExplosive(),
      },
      {
        x: this.finalBoss?.x ?? 400, y: this.finalBoss?.y ?? 300, r: 58,
        available: () => this.currentRoom === 'patio'
          && this.finalBossDefeated
          && !this.finalBossKeyCollected,
        text: () => 'Recoger la llave del jefe',
        action: () => this.collectFinalBossKey(),
      },
      {
        x: 400, y: 145, r: 84,
        available: () => this.currentRoom === 'patio',
        text: () => this.patioGateUnlocked ? 'Reja abierta' : 'Abrir la reja del patio',
        action: () => this.openPatioGate(),
      },
      {
        x: 165, y: 398, r: 46,
        available: () => this.currentRoom === 'descanso' && !this.basementLockpickCollected,
        text: () => 'Recoger ganzúa del escritorio',
        action: () => this.collectBasementLockpick(),
      },
      {
        x: 57, y: 278, r: 88,
        available: () => this.currentRoom === 'recepcion',
        text: () => this.basementLockpickCollected
          ? 'Abrir puerta al sótano'
          : 'Puerta cerrada (necesitas una ganzúa)',
        action: () => this.enterBasement(),
      },
      {
        x: 115, y: 50, r: 80,
        available: () => this.currentRoom === 'sotano',
        text: () => 'Volver a recepción',
        action: () => this.returnFromBasement(),
      },
      {
        x: 576, y: 410, r: 90,
        available: () => this.currentRoom === 'sotano',
        text: () => this.basementDoorOpened ? 'Entrar a la sala de control' : 'Introducir código en el panel',
        action: () => this.basementDoorOpened ? this.enterControlRoom() : this.openBasementPuzzle(),
      },
      {
        x: 730, y: 300, r: 220,
        available: () => this.currentRoom === 'sala-control' && this.controlRoomLightsOff,
        text: () => this.restRoomSpareFuseCollected
          ? 'Instalar fusible en la caja de la pared'
          : 'Revisar caja de fusibles de la pared',
        action: () => this.installRestRoomSpareFuse(),
      },
      {
        x: 460, y: 545, r: 85,
        available: () => this.currentRoom === 'sala-control',
        text: () => 'Volver al sótano',
        action: () => this.returnFromControlRoom(),
      },
      {
        x: 380, y: 300, r: 100,
        available: () => this.currentRoom === 'sala-control'
          && !this.controlRoomLightsOff
          && !this.patioDoorUnlocked,
        text: () => 'Presionar el botón',
        action: () => this.activateControlRoomButton(),
      },
      {
        x: 380, y: 477, r: 48,
        available: () => this.currentRoom === 'sala-control',
        text: () => 'Leer nota',
        action: () => this.openNote(NOTA_CONTROL),
      },
      {
        x: 550, y: 270, r: 58,
        available: () => this.currentRoom === 'descanso' && !!this.restRoomWeapon,
        text: () => `Cambiar por ${WEAPONS[this.restRoomWeapon].nombre}`,
        action: () => this.openRestWeaponChoice(),
      },
      {
        x: 585, y: 375, r: 85,
        available: () => this.currentRoom === 'recepcion',
        text: () => this.weapon ? 'Cambiar de arma con Marvin' : 'Revisar a Marvin y elegir un arma',
        action: () => this.openChoice(),
      },
      {
        x: 465, y: 174, r: 100,
        available: () => this.currentRoom === 'recepcion',
        text: () => 'Leer nota',
        action: () => this.openNote(),
      },
      {
        x: 144, y: 150, r: 70,
        available: () => this.zombieSpawned
          && this.currentRoom === 'recepcion',
        text: () => 'Entrar al pasillo',
        action: () => this.enterHallway(),
      },
      {
        x: 400, y: 555, r: 70,
        available: () => this.currentRoom === 'pasillo',
        text: () => 'Volver a la recepción',
        action: () => this.returnToReception(),
      },
      {
        x: 400, y: 50, r: 85,
        available: () => this.currentRoom === 'pasillo',
        text: () => this.patioDoorUnlocked ? 'Salir al patio' : 'Puerta del patio sin energía',
        action: () => this.exitToPatio(),
      },
      {
        x: 400, y: 550, r: 75,
        available: () => this.currentRoom === 'patio',
        text: () => 'Volver al pasillo',
        action: () => this.returnFromPatio(),
      },
      {
        x: 548, y: 410, r: 70,
        available: () => this.currentRoom === 'pasillo',
        text: () => 'Entrar al área de celdas',
        action: () => this.enterCells(),
      },
      {
        x: 656, y: 155, r: 66,
        available: () => this.currentRoom === 'recepcion',
        text: () => this.restRoomKeyCollected
          ? 'Entrar a la sala de descanso'
          : 'Puerta cerrada (necesitas una llave)',
        action: () => this.enterRestRoom(),
      },
      {
        x: 400, y: 550, r: 100,
        available: () => this.currentRoom === 'descanso',
        text: () => 'Salir por la puerta a recepción',
        action: () => this.returnFromRestRoom(),
      },
      {
        x: 400, y: 414, r: 88,
        available: () => this.currentRoom === 'descanso',
        text: () => 'Mirar mesa de billar',
        action: () => this.toast('Qué curioso… amarillo 1, verde 2, rojo 4 y azul 3'),
      },
      {
        x: 652, y: 274, r: 48,
        available: () => this.currentRoom === 'descanso' && !this.restNoteRead,
        text: () => 'Leer hojas',
        action: () => this.openRestNote(),
      },
      {
        x: 620, y: 320, r: 42,
        available: () => this.currentRoom === 'descanso'
          && this.controlRoomLightsOff
          && !this.restRoomSpareFuseCollected,
        text: () => 'Recoger fusible de repuesto',
        action: () => this.collectRestRoomSpareFuse(),
      },
      {
        x: 480, y: 550, r: 42,
        available: () => this.currentRoom === 'celdas',
        text: () => 'Volver al pasillo',
        action: () => this.returnToHallway(),
      },
      {
        x: 720, y: 235, r: 75,
        available: () => this.currentRoom === 'celdas',
        text: () => 'Usar computador',
        action: () => this.openComputer(),
      },
      {
        x: 620, y: 190, r: 50,
        available: () => this.currentRoom === 'celdas',
        text: () => 'Leer post-it',
        action: () => this.openNote(NOTA_PC),
      },
      {
        x: 220, y: 515, r: 42,
        available: () => this.currentRoom === 'celdas'
          && !this.restRoomKeyCollected
          && this.cellDoorStates[2] === 'open',
        text: () => 'Recoger llave',
        action: () => this.collectRestRoomKey(),
      },
      ...this.healingItems.map((item) => ({
        x: item.x,
        y: item.y,
        r: 42,
        available: () => this.currentRoom === item.room && !this.collectedHealingItems.has(item.id),
        text: () => `Usar ${item.name} (+${item.health} PV)`,
        action: () => this.collectHealingItem(item.id),
      })),
      ...this.ammoItems.map((item) => ({
        x: item.x,
        y: item.y,
        r: 42,
        available: () => this.currentRoom === item.room && !this.collectedAmmoItems.has(item.id),
        text: () => `Recoger munición (+${item.amount})`,
        action: () => this.collectAmmoPickup(item.id),
      })),
    ];
  }

  // ---------- Estado y HUD ----------
  refresh() {
    const el = $('weapon-name');
    el.textContent = this.weapon ? WEAPONS[this.weapon].nombre : 'Desarmado';
    el.classList.toggle('empty', !this.weapon);
    const ammoValue = $('ammo-value');
    const firearm = this.weapon === 'pistola' || this.weapon === 'escopeta';
    ammoValue.classList.toggle('hidden', !firearm);
    if (firearm) {
      const unit = this.weapon === 'pistola' ? 'BALAS' : 'CARTUCHOS';
      ammoValue.textContent = `${unit}: ${this.ammo[this.weapon]}`;
    }

    this.itemPistola.setVisible(this.currentRoom === 'recepcion' && this.corpse.includes('pistola'));
    this.itemBate.setVisible(this.currentRoom === 'recepcion' && this.corpse.includes('bate'));

    if (this.player && !this.player.anims.isPlaying) {
      if (this.aiming) this.setAimSprite();
      else this.setPlayerIdle();
    }
  }

  toast(msg) {
    const t = $('toast');
    t.textContent = msg; t.classList.remove('hidden');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => t.classList.add('hidden'), 2200);
  }

  // ---------- Decisión de objetos ----------
  openChoice() {
    this.ui = 'choice';
    const cards = this.corpse.map((id, i) => {
      const w = WEAPONS[id];
      return `<button class="card" data-id="${id}"><span class="key">${i + 1}</span>
        <h3>${w.nombre}</h3><p class="tipo">${w.tipo}</p><p>${w.desc}</p></button>`;
    }).join('');
    const aviso = this.weapon
      ? `Si cambias, dejarás tu ${WEAPONS[this.weapon].nombre} junto al cuerpo.`
      : 'Solo puedes cargar un arma a la vez. Elige bien.';
    $('modal-body').innerHTML = `
      <div class="panel">
        <h2>AGENTE M</h2>
        <p class="sub">Aún tiene su equipo encima.</p>
        <div class="cards">${cards}</div>
        <div class="foot"><span>${aviso}</span><button class="btn" id="btn-leave">DEJARLO [ESC]</button></div>
      </div>`;
    $('modal-body').querySelectorAll('.card').forEach((b) => (b.onclick = () => this.equip(b.dataset.id)));
    $('btn-leave').onclick = () => this.closeUi();
    $('modal').classList.remove('hidden');
  }

  openRestWeaponChoice() {
    if (!this.restRoomWeapon) return;
    this.ui = 'rest-weapon-choice';
    const pickupName = WEAPONS[this.restRoomWeapon].nombre;
    const currentWeapon = this.weapon ? WEAPONS[this.weapon].nombre : null;
    $('modal-body').innerHTML = `
      <div class="panel">
        <h2>ARMA EN EL SUELO</h2>
        <p class="sub">Encontraste una ${pickupName.toLowerCase()}.</p>
        <div class="cards">
          <button class="card" data-action="take"><span class="key">1</span>
            <h3>Tomar ${pickupName}</h3><p class="tipo">${WEAPONS[this.restRoomWeapon].tipo}</p>
            <p>${WEAPONS[this.restRoomWeapon].desc}</p></button>
          ${currentWeapon ? `<button class="card" data-action="keep"><span class="key">2</span>
            <h3>Conservar ${currentWeapon}</h3><p class="tipo">Mantener equipo</p>
            <p>Dejar la ${pickupName.toLowerCase()} en el suelo.</p></button>` : ''}
        </div>
        <div class="foot"><span>${currentWeapon
    ? `Si cambias, dejarás tu ${currentWeapon} aquí.`
    : 'Solo puedes cargar un arma a la vez.'}</span>
          <button class="btn" id="btn-leave">DEJARLA [ESC]</button></div>
      </div>`;
    $('modal-body').querySelector('[data-action="take"]').onclick = () => this.swapRestRoomWeapon();
    $('modal-body').querySelector('[data-action="keep"]')?.addEventListener('click', () => this.closeUi());
    $('btn-leave').onclick = () => this.closeUi();
    $('modal').classList.remove('hidden');
  }

  swapRestRoomWeapon() {
    if (!this.restRoomWeapon) return;
    const pickedUp = this.restRoomWeapon;
    this.restRoomWeapon = this.weapon;
    this.weapon = pickedUp;
    this.grantStartingAmmo(pickedUp);
    this.setRestRoomWeaponSprite();
    this.refresh();
    this.closeUi();
    this.toast(`Cambiaste por: ${WEAPONS[pickedUp].nombre}.`);
  }

  equip(id) {
    if (!this.corpse.includes(id)) return;
    const firstPickup = !this.weapon && !this.zombieSpawned;
    if (this.weapon) this.corpse.push(this.weapon);       // el arma anterior queda en el cuerpo
    this.corpse = this.corpse.filter((w) => w !== id);
    this.weapon = id;
    this.grantStartingAmmo(id);
    this.refresh();
    this.closeUi();
    if (firstPickup) {
      this.spawnZombie();
    }
    else this.toast(`Tomaste: ${WEAPONS[id].nombre}`);
  }

  openNote(note = NOTA_1) {
    if (note === NOTA_1) {
      this.noteRead = true;
      this.noteGlint.setVisible(false);
    } else if (note === NOTA_DESCANSO) {
      this.restNoteRead = true;
      this.restNoteGlint.setVisible(false);
    } else if (note === NOTA_CONTROL) {
      this.controlRoomNoteRead = true;
      this.controlRoomNoteGlint.setVisible(false);
    }
    this.ui = 'note';
    $('modal-body').innerHTML = `
      <div class="paper">
        <h2>${note.titulo}</h2>
        ${note.parrafos.map((p) => `<p>${p}</p>`).join('')}
        <p class="sign">${note.firma}</p>
        <div class="close">[E] CERRAR</div>
      </div>`;
    $('modal').classList.remove('hidden');
  }

  openRestNote() {
    this.openNote(NOTA_DESCANSO);
  }

  openComputer() {
    if (this.currentRoom !== 'celdas') return;
    if (!this.computerKeyboardCaptureRemoved) {
      this.input.keyboard.removeCapture([
        Phaser.Input.Keyboard.KeyCodes.W,
        Phaser.Input.Keyboard.KeyCodes.A,
        Phaser.Input.Keyboard.KeyCodes.S,
        Phaser.Input.Keyboard.KeyCodes.D,
      ]);
      this.computerKeyboardCaptureRemoved = true;
    }
    this.ui = 'computer';
    this.showComputerFrame(0, `
      <form class="computer-login" id="computer-login">
        <input id="computer-username" name="username" type="text" autocomplete="off" aria-label="Usuario">
        <input id="computer-password" name="password" type="password" autocomplete="off" aria-label="Contraseña">
        <button type="submit" aria-label="Entrar"></button>
      </form>
      <button class="computer-close" type="button" aria-label="Cerrar computador">×</button>
    `);
    $('computer-login').addEventListener('submit', (event) => {
      event.preventDefault();
      const username = $('computer-username').value.trim();
      const password = $('computer-password').value;
      this.submitComputerLogin(username, password);
    });
    $('modal-body').querySelector('.computer-close').addEventListener('click', () => this.closeComputer());
    $('computer-username').focus();
  }

  showComputerFrame(frame, content = '') {
    $('modal-body').innerHTML = `
      <div class="computer-screen">
        <img class="computer-art" src="${this.computerFrames[frame]}" alt="Pantalla del computador">
        ${content}
      </div>`;
    $('modal').classList.remove('hidden');
  }

  submitComputerLogin(username, password) {
    if (username !== 'admin' || password !== 'admin') {
      this.showComputerFrame(1, `
        <button class="computer-action computer-retry" type="button">REINTENTAR</button>
        <button class="computer-close" type="button" aria-label="Cerrar computador">×</button>
      `);
      $('modal-body').querySelector('.computer-retry').addEventListener('click', () => this.openComputer());
      $('modal-body').querySelector('.computer-close').addEventListener('click', () => this.closeComputer());
      return;
    }

    this.ui = 'computer-validating';
    this.showComputerFrame(2, '<div class="computer-progress"><div class="computer-progress-bar"></div></div>');
    this.computerValidationTimer = setTimeout(() => {
      this.computerValidationTimer = null;
      if (this.ui !== 'computer-validating') return;
      this.ui = 'computer-authorized';
      this.showComputerFrame(3, '<button class="computer-action computer-continue" type="button">CONTINUAR</button>');
      $('modal-body').querySelector('.computer-continue').addEventListener('click', () => this.showComputerConfirmation());
    }, 1500);
  }

  showComputerConfirmation() {
    this.ui = 'computer-confirmation';
    this.showComputerFrame(4, `
      <button class="computer-action computer-yes" type="button">SÍ</button>
      <button class="computer-action computer-no" type="button">NO</button>
    `);
    $('modal-body').querySelector('.computer-yes').addEventListener('click', () => {
      this.openAllCellDoors();
      this.ui = 'computer-unlocked';
      this.showComputerFrame(5, '');
    });
    $('modal-body').querySelector('.computer-no').addEventListener('click', () => {
      this.ui = 'computer-authorized';
      this.showComputerFrame(3, '<button class="computer-action computer-continue" type="button">CONTINUAR</button>');
      $('modal-body').querySelector('.computer-continue').addEventListener('click', () => this.showComputerConfirmation());
    });
  }

  closeComputer() {
    if (this.computerValidationTimer !== null) {
      clearTimeout(this.computerValidationTimer);
      this.computerValidationTimer = null;
    }
    this.closeUi();
  }

  closeUi() {
    this.ui = null;
    $('modal').classList.add('hidden');
    if (this.computerKeyboardCaptureRemoved) {
      this.input.keyboard.addCapture([
        Phaser.Input.Keyboard.KeyCodes.W,
        Phaser.Input.Keyboard.KeyCodes.A,
        Phaser.Input.Keyboard.KeyCodes.S,
        Phaser.Input.Keyboard.KeyCodes.D,
      ]);
      this.computerKeyboardCaptureRemoved = false;
    }
  }

  onKey(ev) {
    if (ev.repeat) return;
    const key = ev.key.toLowerCase();
    if (key === 'f' && !this.ui && this.controlRoomLightsOff) {
      this.toggleControlRoomFlashlight();
      return;
    }
    if (key === 'h' && !this.ui) {
      this.hudHidden = !this.hudHidden;
      $('hud').classList.toggle('hud-hidden', this.hudHidden);
    } else if (this.ui === 'choice') {
      if (key === '1' || key === '2') this.equip(this.corpse[Number(key) - 1]);
      if (key === 'escape' || key === 'e') this.closeUi();
    } else if (this.ui === 'rest-weapon-choice') {
      if (key === '1') this.swapRestRoomWeapon();
      if (key === '2' && this.weapon) this.closeUi();
      if (key === 'escape' || key === 'e') this.closeUi();
    } else if (this.ui === 'basement-puzzle') {
      if (key === 'escape') {
        this.basementPuzzleProgress = [];
        this.closeUi();
      }
    } else if (this.ui === 'note') {
      if (key === 'escape' || key === 'e') this.closeUi();
    } else if (this.ui === 'ending-credits') {
      if (key === 'escape') window.location.reload();
    } else if (this.ui === 'computer') {
      if (key === 'escape') this.closeComputer();
    } else if (this.ui === 'computer-validating') {
      if (key === 'escape') this.closeComputer();
      return;
    } else if (this.ui === 'computer-authorized') {
      if (key === 'escape') this.closeComputer();
      if (key === 'enter') this.showComputerConfirmation();
    } else if (this.ui === 'computer-confirmation') {
      if (key === 'escape' || key === 'n') {
        this.ui = 'computer-authorized';
        this.showComputerFrame(3, '<button class="computer-action computer-continue" type="button">CONTINUAR</button>');
        $('modal-body').querySelector('.computer-continue').addEventListener('click', () => this.showComputerConfirmation());
      } else if (key === 'y' || key === 's') {
        $('modal-body').querySelector('.computer-yes').click();
      }
    } else if (this.ui === 'computer-unlocked') {
      if (key === 'escape' || key === 'e') this.closeComputer();
    } else if (key === 'e') {
      if (this.currentRoom === 'descanso'
        && Math.abs(this.player.x - 400) < 90
        && this.player.y >= 470) {
        this.returnFromRestRoom();
        return;
      }
      this.getNearbyInteractable()?.action();
    }
  }

  getNearbyInteractable() {
    const px = this.player.x, py = this.player.y;
    let nearest = null, best = Infinity;
    for (const interactable of this.interactables) {
      if (interactable.available && !interactable.available()) continue;
      const distance = Phaser.Math.Distance.Between(px, py, interactable.x, interactable.y);
      if (distance < interactable.r && distance < best) {
        nearest = interactable;
        best = distance;
      }
    }
    return nearest;
  }

  // ---------- Bucle ----------
  update(time, delta) {
    if (this.controlRoomLightsOff) {
      this.renderControlRoomLighting();
    }

    if (!this.gameStarted) {
      this.movementKeys.clear();
      this.player.body.setVelocity(0, 0);
      if (this.zombie?.body) this.zombie.body.setVelocity(0, 0);
      if (this.finalBoss?.body) this.finalBoss.body.setVelocity(0, 0);
      $('prompt').classList.add('hidden');
      return;
    }

    this.syncMusic();

    if (!this.playerAlive) {
      this.movementKeys.clear();
      this.player.body.setVelocity(0, 0);
      if (this.zombie?.body) this.zombie.body.setVelocity(0, 0);
      return;
    }

    if (this.ui) {                                  // con un menú abierto, el jugador se detiene
      this.movementKeys.clear();
      this.player.body.setVelocity(0, 0);
      if (this.zombie?.body) this.zombie.body.setVelocity(0, 0);
      if (this.finalBoss?.body) this.finalBoss.body.setVelocity(0, 0);
      this.roomZombies.forEach(({ sprite }) => sprite.body.setVelocity(0, 0));
      this.cellZombies.forEach(({ sprite }) => sprite.body.setVelocity(0, 0));
      $('prompt').classList.add('hidden');
      return;
    }

    this.updateZombie(delta);

    // Movimiento
    const k = this.keys;
    const movementKeys = this.movementKeys;
    const isDown = (key, fallbackKey) => k[key].isDown || movementKeys.has(fallbackKey);
    const tryingLockedDoor = this.entryDoorState === 'locked'
      && !this.weapon
      && isDown('W', 'w')
      && Math.abs(this.player.x - 144) < 55
      && this.player.y < 172;
    if (tryingLockedDoor && !this.doorBlockedNotified) {
      this.toast('Está bloqueada del otro lado');
      this.doorBlockedNotified = true;
    } else if (!isDown('W', 'w') || !tryingLockedDoor) {
      this.doorBlockedNotified = false;
    }
    const v = new Phaser.Math.Vector2(
      (isDown('D', 'd') || isDown('RIGHT', 'arrowright') ? 1 : 0)
        - (isDown('A', 'a') || isDown('LEFT', 'arrowleft') ? 1 : 0),
      (isDown('S', 's') || isDown('DOWN', 'arrowdown') ? 1 : 0)
        - (isDown('W', 'w') || isDown('UP', 'arrowup') ? 1 : 0)
    ).normalize().scale(this.getPlayerSpeed());
    if (this.attackInProgress) {
      this.player.body.setVelocity(0, 0);
      $('prompt').classList.add('hidden');
      return;
    }
    if (this.currentRoom === 'sotano') {
      const step = Math.min(delta / 1000, .05);
      const nextX = this.player.x + v.x * step;
      const nextY = this.player.y + v.y * step;
      if (!this.isBasementWalkable(nextX, nextY)) {
        const canMoveX = this.isBasementWalkable(nextX, this.player.y);
        const canMoveY = this.isBasementWalkable(this.player.x, nextY);
        v.x = canMoveX ? v.x : 0;
        v.y = canMoveY ? v.y : 0;
      }
    }
    this.player.body.setVelocity(v.x, v.y);
    this.updateFinalBoss();

    if (this.aiming) {
      this.setAimSprite();
    } else {
      const moving = v.lengthSq() > 0;
      if (moving) {
        const directionIndex = Phaser.Math.Wrap(Math.round(Phaser.Math.Angle.Normalize(Math.atan2(v.y, v.x)) / (Math.PI / 4)), 0, MOVEMENT_DIRECTIONS.length);
        const direction = MOVEMENT_DIRECTIONS[directionIndex];
        this.facing = direction;
        this.player.play(`walk-${direction}`, true);
      } else {
        this.setPlayerIdle();
      }
    }

    // Objeto interactivo más cercano
    const near = this.getNearbyInteractable();
    const pr = $('prompt');
    if (near) { $('prompt-text').textContent = near.text(); pr.classList.remove('hidden'); }
    else pr.classList.add('hidden');
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game',
  pixelArt: true,
  backgroundColor: '#07070a',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: { default: 'arcade', arcade: { debug: false } },
  scene: [Recepcion],
});

$('test-damage-button').addEventListener('click', () => {
  game.scene.getScene('Recepcion').applyPlayerDamage(20, 'Daño de prueba: -20 PV.');
});

$('play-button').addEventListener('click', () => {
  $('main-menu').classList.add('hidden');
  $('game-ui').classList.remove('hidden');
  const scene = game.scene.getScene('Recepcion');
  scene.gameStarted = true;
  scene.player?.body.setVelocity(0, 0);
  scene.syncMusic(true);
  game.canvas.focus();
});

$('credits-button').addEventListener('click', () => {
  $('menu-panel').classList.add('hidden');
  $('credits-panel').classList.remove('hidden');
});

$('credits-back-button').addEventListener('click', () => {
  $('credits-panel').classList.add('hidden');
  $('menu-panel').classList.remove('hidden');
});

$('exit-button').addEventListener('click', () => {
  $('menu-panel').classList.add('hidden');
  $('exit-message').classList.remove('hidden');
});

$('exit-back-button').addEventListener('click', () => {
  $('exit-message').classList.add('hidden');
  $('menu-panel').classList.remove('hidden');
});

$('retry-button').addEventListener('click', () => {
  sessionStorage.setItem('hotline-start-game', '1');
  window.location.reload();
});
