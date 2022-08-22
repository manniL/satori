import React from 'react'
import { it, describe, expect, beforeEach, afterEach } from 'vitest'

import { initFonts } from './utils'
import satori from '../src'

describe('Image', () => {
  let fonts
  initFonts((f) => (fonts = f))

  let requests = []

  beforeEach(() => {
    // Polyfill fetch
    requests = []
    ;(globalThis as any).fetch = async (url) => {
      requests.push(url)
      return {
        headers: {
          get: (key) => {
            if (key === 'content-type') return 'image/png'
          },
        },
        arrayBuffer: async () => new ArrayBuffer(100),
      }
    }
  })

  afterEach(() => {
    delete globalThis.fetch
  })

  describe('img', () => {
    it('should resolve image data', async () => {
      const svg = await satori(
        <div
          style={{
            border: '1px solid',
            width: '50%',
            height: '50%',
            display: 'flex',
          }}
        >
          <img
            width='100%'
            height='100%'
            src='https://via.placeholder.com/150'
          />
        </div>,
        { width: 100, height: 100, fonts }
      )
      expect(svg).toMatchInlineSnapshot(
        '"<svg width=\\"100\\" height=\\"100\\" viewBox=\\"0 0 100 100\\" xmlns=\\"http://www.w3.org/2000/svg\\"><defs><clipPath id=\\"satori_bc-id\\"><rect x=\\"0\\" y=\\"0\\" width=\\"50\\" height=\\"50\\"/></clipPath></defs><rect x=\\"0\\" y=\\"0\\" width=\\"50\\" height=\\"50\\" fill=\\"transparent\\" stroke=\\"black\\" stroke-width=\\"2\\" clip-path=\\"url(#satori_bc-id)\\"/><image x=\\"1\\" y=\\"1\\" width=\\"100\\" height=\\"100\\" href=\\"data:image/png;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==\\" preserveAspectRatio=\\"none\\"/></svg>"'
      )

      expect(requests).toEqual(['https://via.placeholder.com/150'])
    })

    it('should deduplicate image data requests', async () => {
      const svg = await satori(
        <div
          style={{
            border: '1px solid',
            width: '50%',
            height: '50%',
            display: 'flex',
          }}
        >
          <img width='10%' height='10%' src='https://via.placeholder.com/200' />
          <img width='20%' height='30%' src='https://via.placeholder.com/200' />
        </div>,
        { width: 100, height: 100, fonts }
      )
      expect(svg).toMatchInlineSnapshot(
        '"<svg width=\\"100\\" height=\\"100\\" viewBox=\\"0 0 100 100\\" xmlns=\\"http://www.w3.org/2000/svg\\"><defs><clipPath id=\\"satori_bc-id\\"><rect x=\\"0\\" y=\\"0\\" width=\\"50\\" height=\\"50\\"/></clipPath></defs><rect x=\\"0\\" y=\\"0\\" width=\\"50\\" height=\\"50\\" fill=\\"transparent\\" stroke=\\"black\\" stroke-width=\\"2\\" clip-path=\\"url(#satori_bc-id)\\"/><image x=\\"1\\" y=\\"1\\" width=\\"10\\" height=\\"10\\" href=\\"data:image/png;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==\\" preserveAspectRatio=\\"none\\"/><image x=\\"11\\" y=\\"1\\" width=\\"20\\" height=\\"30\\" href=\\"data:image/png;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==\\" preserveAspectRatio=\\"none\\"/></svg>"'
      )

      expect(requests).toEqual(['https://via.placeholder.com/200'])
    })
  })

  describe('background-image: url()', () => {
    it('should resolve image data', async () => {
      const svg = await satori(
        <div
          style={{
            border: '1px solid',
            width: '50%',
            height: '50%',
            display: 'flex',
            backgroundImage: 'url(https://via.placeholder.com/300)',
          }}
        ></div>,
        { width: 100, height: 100, fonts }
      )
      expect(svg).toMatchInlineSnapshot(
        '"<svg width=\\"100\\" height=\\"100\\" viewBox=\\"0 0 100 100\\" xmlns=\\"http://www.w3.org/2000/svg\\"><defs><pattern id=\\"satori_biid_0\\" patternContentUnits=\\"userSpaceOnUse\\" patternUnits=\\"userSpaceOnUse\\" x=\\"0\\" y=\\"0\\" width=\\"50\\" height=\\"50\\"><image x=\\"0\\" y=\\"0\\" width=\\"50\\" height=\\"50\\" href=\\"data:image/png;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==\\"/></pattern><clipPath id=\\"satori_bc-id\\"><rect x=\\"0\\" y=\\"0\\" width=\\"50\\" height=\\"50\\"/></clipPath></defs><rect x=\\"0\\" y=\\"0\\" width=\\"50\\" height=\\"50\\" fill=\\"url(#satori_biid_0)\\" stroke=\\"black\\" stroke-width=\\"2\\" clip-path=\\"url(#satori_bc-id)\\"/></svg>"'
      )

      expect(requests).toEqual(['https://via.placeholder.com/300'])
    })
  })
})