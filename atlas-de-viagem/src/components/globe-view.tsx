'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type * as CesiumNS from 'cesium'
import { DESTINATIONS } from '@/data/catalog'
import { CATEGORIES, UNCATEGORIZED_COLOR, type Category, type Destination, type Place } from '@/lib/types'
import { clusterImage, destinationImage, pinImage } from './pins'

type Cesium = typeof CesiumNS

/** Acima desta altura (m) a câmera está em visão continental e só os destinos aparecem. */
export const CONTINENTAL_HEIGHT = 1_800_000

export type GlobeMode =
  | { kind: 'satelite' }
  | { kind: 'publico'; token: 'ausente' | 'recusado' }
  | { kind: 'basico'; reason: 'sem-token' | 'token-invalido' }
  | { kind: 'falha'; message: string }

export type CameraIdle = { lat: number; lon: number; height: number }

export type GlobeHandle = {
  flyToDestination: (destination: Destination) => void
  flyToPlace: (place: Place) => void
  flyHome: () => void
}

type Props = {
  places: Place[]
  visibleCategories: Set<Category>
  selectedId: string | null
  creditsContainer: HTMLElement | null
  onSelectPlace: (id: string) => void
  onSelectDestination: (id: string) => void
  onCameraIdle: (camera: CameraIdle) => void
  onModeChange: (mode: GlobeMode) => void
}

declare global {
  interface Window {
    CESIUM_BASE_URL?: string
    Cesium?: Cesium
  }
}

let cesiumScript: Promise<Cesium> | null = null

function loadCesium(): Promise<Cesium> {
  if (window.Cesium) return Promise.resolve(window.Cesium)
  cesiumScript ??= new Promise<Cesium>((resolve, reject) => {
    window.CESIUM_BASE_URL = '/cesium'
    const script = document.createElement('script')
    script.src = '/cesium/Cesium.js'
    script.async = true
    script.onload = () => (window.Cesium ? resolve(window.Cesium) : reject(new Error('Cesium.js não registrou window.Cesium')))
    script.onerror = () => {
      cesiumScript = null
      script.remove()
      reject(new Error('Não foi possível baixar /cesium/Cesium.js'))
    }
    document.head.appendChild(script)
  })
  return cesiumScript
}

const COLOR_BY_CATEGORY = Object.fromEntries(CATEGORIES.map(c => [c.id, c.color])) as Record<Category, string>
const colorFor = (place: Place) => (place.category ? COLOR_BY_CATEGORY[place.category] : UNCATEGORIZED_COLOR)

const HOME = { lon: -60, lat: -21, height: 10_500_000 }

type Runtime = {
  Cesium: Cesium
  viewer: CesiumNS.Viewer
  destinations: CesiumNS.CustomDataSource
  attractions: CesiumNS.CustomDataSource
  /** Fora do agrupamento, para o lugar selecionado nunca sumir dentro de um cluster. */
  selection: CesiumNS.CustomDataSource
  hasTerrain: () => boolean
}

const SELECTED_PREFIX = 'selecionado:'

export const GlobeView = forwardRef<GlobeHandle, Props>(function GlobeView(props, ref) {
  const containerRef = useRef<HTMLDivElement>(null)
  const runtimeRef = useRef<Runtime | null>(null)
  const propsRef = useRef(props)
  propsRef.current = props

  useImperativeHandle(ref, () => ({
    flyToDestination(destination) {
      const rt = runtimeRef.current
      if (!rt) return
      const { Cesium, viewer } = rt
      const pitch = Cesium.Math.toRadians(-58)
      const southOffsetDeg = destination.height / Math.tan(-pitch) / 111_320
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(destination.lon, destination.lat - southOffsetDeg, destination.height),
        orientation: { heading: 0, pitch, roll: 0 },
        duration: 3,
      })
    },
    flyToPlace(place) {
      const rt = runtimeRef.current
      if (!rt) return
      void flyToPlace(rt, place)
    },
    flyHome() {
      const rt = runtimeRef.current
      if (!rt) return
      rt.viewer.camera.flyTo({
        destination: rt.Cesium.Cartesian3.fromDegrees(HOME.lon, HOME.lat, HOME.height),
        duration: 2.5,
      })
    },
  }))

  useEffect(() => {
    let cancelled = false
    let cleanup: (() => void) | undefined

    async function boot() {
      const Cesium = await loadCesium()
      if (cancelled || !containerRef.current) return

      const token = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN?.trim()
      const naturalEarth = () =>
        Cesium.ImageryLayer.fromProviderAsync(
          Cesium.TileMapServiceImageryProvider.fromUrl(Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII'))
        )
      const publicSatellite = () => {
        const provider = new Cesium.UrlTemplateImageryProvider({
          url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          credit: 'Imagens: Esri, Maxar, Earthstar Geographics e a comunidade de usuários do GIS',
          maximumLevel: 19,
        })
        return { layer: new Cesium.ImageryLayer(provider), provider }
      }

      let baseLayer: CesiumNS.ImageryLayer
      let terrain: CesiumNS.Terrain | undefined
      let publicProvider: CesiumNS.UrlTemplateImageryProvider | undefined
      if (token) {
        Cesium.Ion.defaultAccessToken = token
        baseLayer = Cesium.ImageryLayer.fromProviderAsync(
          Cesium.createWorldImageryAsync({ style: Cesium.IonWorldImageryStyle.AERIAL })
        )
        terrain = Cesium.Terrain.fromWorldTerrain()
      } else {
        const satellite = publicSatellite()
        baseLayer = satellite.layer
        publicProvider = satellite.provider
      }

      const viewer = new Cesium.Viewer(containerRef.current, {
        baseLayer,
        terrain,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        infoBox: false,
        selectionIndicator: false,
        creditContainer: propsRef.current.creditsContainer ?? undefined,
        requestRenderMode: true,
        maximumRenderTimeChange: Infinity,
      })
      const scene = viewer.scene
      scene.globe.depthTestAgainstTerrain = Boolean(token)
      scene.globe.baseColor = Cesium.Color.fromCssColorString('#13283A')
      scene.backgroundColor = Cesium.Color.fromCssColorString('#070F16')
      scene.screenSpaceCameraController.minimumZoomDistance = 250
      viewer.camera.setView({ destination: Cesium.Cartesian3.fromDegrees(HOME.lon, HOME.lat, HOME.height) })

      let terrainOk = Boolean(token)
      let usingNaturalEarth = false
      const useNaturalEarth = (reason: 'sem-token' | 'token-invalido') => {
        if (usingNaturalEarth) return
        usingNaturalEarth = true
        viewer.imageryLayers.remove(baseLayer, false)
        baseLayer = naturalEarth()
        viewer.imageryLayers.add(baseLayer, 0)
        propsRef.current.onModeChange({ kind: 'basico', reason })
        scene.requestRender()
      }
      const watchPublicTiles = (provider: CesiumNS.UrlTemplateImageryProvider, reason: 'sem-token' | 'token-invalido') => {
        provider.errorEvent.addEventListener(error => {
          if (error.level !== 0 || error.timesRetried < 2) return
          useNaturalEarth(reason)
        })
      }
      if (publicProvider) {
        propsRef.current.onModeChange({ kind: 'publico', token: 'ausente' })
        watchPublicTiles(publicProvider, 'sem-token')
      } else {
        propsRef.current.onModeChange({ kind: 'satelite' })
      }
      if (token) {
        baseLayer.errorEvent.addEventListener(() => {
          if (baseLayer.ready) return
          const satellite = publicSatellite()
          viewer.imageryLayers.remove(baseLayer, false)
          baseLayer = satellite.layer
          viewer.imageryLayers.add(baseLayer, 0)
          propsRef.current.onModeChange({ kind: 'publico', token: 'recusado' })
          watchPublicTiles(satellite.provider, 'token-invalido')
          scene.requestRender()
        })
        terrain?.errorEvent.addEventListener(() => {
          terrainOk = false
          scene.globe.depthTestAgainstTerrain = false
          scene.terrainProvider = new Cesium.EllipsoidTerrainProvider()
          scene.requestRender()
        })
      }

      const destinations = new Cesium.CustomDataSource('destinos')
      const attractions = new Cesium.CustomDataSource('atracoes')
      attractions.clustering.enabled = true
      attractions.clustering.pixelRange = 44
      attractions.clustering.minimumClusterSize = 2
      attractions.clustering.clusterEvent.addEventListener((entities, cluster) => {
        cluster.label.show = false
        cluster.billboard.show = true
        cluster.billboard.id = cluster.label.id
        cluster.billboard.setImage(`cluster-${entities.length}`, clusterImage(entities.length))
        cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.CENTER
        cluster.billboard.disableDepthTestDistance = Number.POSITIVE_INFINITY
      })

      for (const destination of DESTINATIONS) {
        destinations.entities.add({
          id: `destino:${destination.id}`,
          name: destination.name,
          position: Cesium.Cartesian3.fromDegrees(destination.lon, destination.lat),
          billboard: {
            image: destinationImage(),
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          label: {
            text: destination.name,
            font: '600 15px Manrope, system-ui, sans-serif',
            fillColor: Cesium.Color.fromCssColorString('#F4E9D8'),
            outlineColor: Cesium.Color.fromCssColorString('#0E1A24'),
            outlineWidth: 4,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            ...labelPlacement(Cesium, destination.labelSide),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
        })
      }
      const selection = new Cesium.CustomDataSource('selecao')
      await viewer.dataSources.add(destinations)
      await viewer.dataSources.add(attractions)
      await viewer.dataSources.add(selection)
      if (cancelled) {
        viewer.destroy()
        return
      }

      const rt: Runtime = { Cesium, viewer, destinations, attractions, selection, hasTerrain: () => terrainOk }
      runtimeRef.current = rt
      syncPlaces(rt, propsRef.current)
      updateLevelOfDetail(rt)

      const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
      handler.setInputAction((event: CesiumNS.ScreenSpaceEventHandler.PositionedEvent) => {
        const picked = scene.pick(event.position)
        const id: unknown = picked?.id
        if (Array.isArray(id)) {
          zoomToCluster(rt, id as CesiumNS.Entity[])
          return
        }
        if (!(id instanceof Cesium.Entity)) return
        if (id.id.startsWith('destino:')) propsRef.current.onSelectDestination(id.id.slice('destino:'.length))
        else propsRef.current.onSelectPlace(id.id.replace(SELECTED_PREFIX, ''))
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

      let lastHover = 0
      handler.setInputAction((event: CesiumNS.ScreenSpaceEventHandler.MotionEvent) => {
        const now = performance.now()
        if (now - lastHover < 60) return
        lastHover = now
        const picked = scene.pick(event.endPosition)
        scene.canvas.style.cursor = picked?.id ? 'pointer' : ''
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

      viewer.camera.percentageChanged = 0.05
      const removeChanged = viewer.camera.changed.addEventListener(() => updateLevelOfDetail(rt))
      const removeMoveEnd = viewer.camera.moveEnd.addEventListener(() => {
        updateLevelOfDetail(rt)
        const idle = cameraCenter(rt)
        if (idle) propsRef.current.onCameraIdle(idle)
      })

      cleanup = () => {
        removeChanged()
        removeMoveEnd()
        handler.destroy()
        runtimeRef.current = null
        if (!viewer.isDestroyed()) viewer.destroy()
      }
    }

    boot().catch(error => {
      console.error('[globo] falha ao iniciar o Cesium', error)
      if (!cancelled) propsRef.current.onModeChange({ kind: 'falha', message: String(error?.message ?? error) })
    })
    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  useEffect(() => {
    const rt = runtimeRef.current
    if (rt) syncPlaces(rt, props)
  }, [props.places, props.visibleCategories, props.selectedId])

  return <div ref={containerRef} className="globe" aria-label="Globo 3D interativo" role="application" />
})

function labelPlacement(Cesium: Cesium, side: Destination['labelSide']) {
  if (side === 'below') {
    return { pixelOffset: new Cesium.Cartesian2(0, 30), horizontalOrigin: Cesium.HorizontalOrigin.CENTER }
  }
  return {
    pixelOffset: new Cesium.Cartesian2(side === 'left' ? -26 : 26, 0),
    horizontalOrigin: side === 'left' ? Cesium.HorizontalOrigin.RIGHT : Cesium.HorizontalOrigin.LEFT,
    verticalOrigin: Cesium.VerticalOrigin.CENTER,
  }
}

function syncPlaces(rt: Runtime, props: Props) {
  const { Cesium, attractions } = rt
  const entities = attractions.entities
  const wanted = new Map(props.places.map(place => [place.id, place]))
  entities.suspendEvents()
  for (const entity of [...entities.values]) {
    if (!wanted.has(entity.id)) entities.remove(entity)
  }
  for (const place of props.places) {
    const selected = place.id === props.selectedId
    const filtered =
      props.visibleCategories.size > 0 && (!place.category || !props.visibleCategories.has(place.category))
    const existing = entities.getById(place.id)
    if (existing) {
      existing.show = !selected && !filtered
      continue
    }
    entities.add({
      id: place.id,
      name: place.name,
      show: !selected && !filtered,
      position: Cesium.Cartesian3.fromDegrees(place.lon, place.lat),
      billboard: pinBillboard(Cesium, place, false),
    })
  }
  entities.resumeEvents()

  const current = rt.selection.entities.values[0]
  const place = props.selectedId ? wanted.get(props.selectedId) : undefined
  if (current && current.id !== `${SELECTED_PREFIX}${place?.id}`) rt.selection.entities.remove(current)
  if (place && !rt.selection.entities.values.length) {
    rt.selection.entities.add({
      id: `${SELECTED_PREFIX}${place.id}`,
      name: place.name,
      position: Cesium.Cartesian3.fromDegrees(place.lon, place.lat),
      billboard: { ...pinBillboard(Cesium, place, true), eyeOffset: new Cesium.Cartesian3(0, 0, -100) },
      label: {
        text: place.name,
        font: '600 14px Manrope, system-ui, sans-serif',
        fillColor: Cesium.Color.fromCssColorString('#F4E9D8'),
        showBackground: true,
        backgroundColor: Cesium.Color.fromCssColorString('#0E1A24').withAlpha(0.88),
        backgroundPadding: new Cesium.Cartesian2(8, 5),
        verticalOrigin: Cesium.VerticalOrigin.TOP,
        pixelOffset: new Cesium.Cartesian2(0, 8),
        eyeOffset: new Cesium.Cartesian3(0, 0, -100),
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    })
  }
  rt.viewer.scene.requestRender()
}

function pinBillboard(Cesium: Cesium, place: Place, selected: boolean): CesiumNS.BillboardGraphics.ConstructorOptions {
  return {
    image: pinImage(colorFor(place), selected),
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    disableDepthTestDistance: Number.POSITIVE_INFINITY,
  }
}

function updateLevelOfDetail(rt: Runtime) {
  const height = rt.viewer.camera.positionCartographic.height
  const continental = height > CONTINENTAL_HEIGHT
  if (rt.destinations.show !== continental || rt.attractions.show === continental) {
    rt.destinations.show = continental
    rt.attractions.show = !continental
    rt.viewer.scene.requestRender()
  }
}

function cameraCenter(rt: Runtime): CameraIdle | null {
  const { Cesium, viewer } = rt
  const scene = viewer.scene
  const center = new Cesium.Cartesian2(scene.canvas.clientWidth / 2, scene.canvas.clientHeight / 2)
  const ray = viewer.camera.getPickRay(center)
  const hit = (ray && scene.globe.pick(ray, scene)) || viewer.camera.pickEllipsoid(center)
  if (!hit) return null
  const carto = Cesium.Cartographic.fromCartesian(hit)
  return {
    lat: Cesium.Math.toDegrees(carto.latitude),
    lon: Cesium.Math.toDegrees(carto.longitude),
    height: viewer.camera.positionCartographic.height,
  }
}

async function groundHeight(rt: Runtime, lon: number, lat: number): Promise<number> {
  const { Cesium, viewer } = rt
  const carto = Cesium.Cartographic.fromDegrees(lon, lat)
  if (rt.hasTerrain()) {
    try {
      const sampled = await Promise.race([
        Cesium.sampleTerrainMostDetailed(viewer.scene.terrainProvider, [carto]),
        new Promise<null>(resolve => setTimeout(() => resolve(null), 1500)),
      ])
      if (sampled?.[0]?.height !== undefined) return sampled[0].height
    } catch {
      // cai para a altura já carregada no globo
    }
  }
  return viewer.scene.globe.getHeight(carto) ?? 0
}

async function flyToPlace(rt: Runtime, place: Place) {
  const { Cesium, viewer } = rt
  const height = await groundHeight(rt, place.lon, place.lat)
  const narrow = viewer.scene.canvas.clientWidth < 760
  viewer.camera.flyToBoundingSphere(
    new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(place.lon, place.lat, height), 0),
    {
      offset: new Cesium.HeadingPitchRange(
        viewer.camera.heading,
        Cesium.Math.toRadians(narrow ? -50 : -32),
        narrow ? 2600 : 1900
      ),
      duration: 2.4,
    }
  )
}

function zoomToCluster(rt: Runtime, entities: CesiumNS.Entity[]) {
  const { Cesium, viewer } = rt
  const now = Cesium.JulianDate.now()
  const positions = entities
    .map(entity => entity.position?.getValue(now))
    .filter((p): p is CesiumNS.Cartesian3 => Boolean(p))
  if (!positions.length) return
  const sphere = Cesium.BoundingSphere.fromPoints(positions)
  viewer.camera.flyToBoundingSphere(sphere, {
    offset: new Cesium.HeadingPitchRange(
      viewer.camera.heading,
      Cesium.Math.toRadians(-60),
      Math.max(sphere.radius * 3.2, 1500)
    ),
    duration: 1.6,
  })
}
