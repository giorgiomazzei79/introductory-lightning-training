import { Lightning, Utils } from '@lightningjs/sdk'

function getBackendData() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ size: 6 })
    }, 500)
  })
}
export default class App extends Lightning.Component {
  static getFonts() {
    return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
  }

  static _template() {
    return {
      w: 1920,
      h: 1080,
      rect: true,
      color: 0xffff0000,
      Background: {
        w: w => w,
        h: h => h,
        rect: true,
        src: 'https://dummyimage.com/1920x1080/fff/aaa',
        color: 0xff333333,
      },
      Container: {
        w: w => w,
        h: h => h,
        rect: true,
        color: 0xff003300,
        flex: {
          alignItems: 'center',
          justifyContent: 'center',
          direction: 'column',
        },
        Heading: {
          text: {
            text: 'test text',
            fontSize: 60,
            lineHeight: 90,
          },
        },
        ButtonColumn: {
          type: ButtonColumn,
          size: 1,
        },
      },
    }
  }

  _setup() {
    const backendCall = async () => {
      const response = await getBackendData()

      this.tag('ButtonColumn').patch({ size: response.size })

      console.log('response: ', response)
    }

    backendCall()
  }

  _getFocused() {
    return this.tag('ButtonColumn')
  }
}

class ButtonColumn extends Lightning.Component {
  static _template() {
    return {
      flex: {
        direction: 'column',
      },
    }
  }

  _init() {
    this._focusIndex = 0
    this._size = this.size

    this.children = Array.from(Array(this.size)).map((x, index) => ({
      type: Button,
      flexItem: { marginTop: index !== 0 ? 20 : 0 },
    }))
  }

  _getFocused() {
    return this.children[this._focusIndex]
  }

  set size(value) {
    console.log('value: ', value)
    this._size = value
    this.children = Array.from(Array(this._size)).map((x, index) => ({
      type: Button,
      flexItem: { marginTop: index !== 0 ? 20 : 0 },
    }))
  }

  get size() {
    return this._size
  }

  _handleDown() {
    if (this._focusIndex < this.children.length - 1) {
      this._focusIndex += 1
    }
  }

  _handleUp() {
    if (this._focusIndex > 0) {
      this._focusIndex -= 1
    }
  }
}

class Button extends Lightning.Component {
  static get squareSize() {
    return 50
  }

  static _template() {
    return {
      w: Button.squareSize,
      h: Button.squareSize,
      rect: true,
      color: 0xffffffff,
    }
  }

  _focus() {
    this.patch({
      smooth: {
        scale: 1.3,
      },
    })
  }

  _unfocus() {
    this.patch({
      smooth: {
        scale: 1,
      },
    })
  }

  _handleEnter() {
    this._selected = !this._selected
    this.patch({
      color: this._selected ? '0xffFF5733' : '0xffffffff',
    })
  }
}
