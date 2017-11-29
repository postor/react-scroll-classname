import { default as React, Component } from 'react'
import $ from 'jquery'

class ScrollClassName extends Component {
  constructor(props) {
    super(props)
    const { sections = [], curSection = 0, curPhrase = 0 } = props
    this.state = {
      sections,
      curSection: 0,
      curPhrase: 0,
      locked: false,
    }

    this._timers = []
  }

  componentDidMount() {
    if (typeof window == 'undefined') {
      return
    }

    //绑定滚轮、滑动事件
    var startY
    this._toClean = {
      mousewheel: (e) => {
        if (event.wheelDelta >= 0) {
          this.scrollUp()
        } else {
          this.scrollDown()
        }
      },
      touchstart: (e) => {
        startY = e.originalEvent.touches[0].clientY
      },
      touchmove: (e) => {
        if (e.originalEvent.touches[0].clientY < startY) {
          this.scrollUp()
        } else if (e.originalEvent.touches[0].clientY > startY) {
          this.scrollDown()
        }
      }
    }
    Object.keys(this._toClean).map((k) => {
      $(window).bind(k, this._toClean[k])
    })
  }

  scrollUp(auto = false) {
    const { locked, sections, curSection, curPhrase } = this.state
    if (locked) return

    let nextSection = curSection, nextPhrase = curPhrase
    if (curPhrase > 0) {
      nextPhrase = curPhrase - 1
    } else if (curSection > 0) {
      nextSection = curSection - 1
      nextPhrase = sections[nextSection].length - 1
    } else {
      return
    }
    this.doScroll('up', curSection, curPhrase, nextSection, nextPhrase, auto)
  }

  scrollDown(auto = false) {
    const { locked, sections, curSection, curPhrase } = this.state
    if (locked) return

    let nextSection = curSection, nextPhrase = curPhrase
    if (curPhrase < sections[curSection].length - 1) {
      nextPhrase = curPhrase + 1
    } else if (curSection < sections.length - 1) {
      nextSection = curSection + 1
      nextPhrase = 0
    } else {
      return
    }
    this.doScroll('down', curSection, curPhrase, nextSection, nextPhrase, auto)
  }

  doScroll(direction, fromSection, fromPhrase, nextSection, nextPhrase, auto) {
    const { onScroll, sections } = this.props
    this.setState({
      curPhrase: nextPhrase,
      curSection: nextSection,
      locked: true,
    })

    const { duration } = (direction == 'up') ? sections[nextSection][nextPhrase] : sections[fromSection][fromPhrase]
    const { autoPrev, autoNext } = sections[nextSection][nextPhrase]
    this._timers.push(setTimeout(() => {
      this.setState({
        locked: false,
      })
      if (autoPrev && direction == 'up') {
        setTimeout(() => this.scrollUp(true))
      }
      if (autoNext && direction == 'down') {
        setTimeout(() => this.scrollDown(true))
      }
    }, duration))

    //trigger out
    if (onScroll) {
      onScroll({
        direction,
        fromSection,
        fromPhrase,
        toSection,
        toPhrase,
      })
    }
  }

  render() {
    const { classNameFn = (curSection, curPhrase) => {
      return `section-${curSection} phrase-${curPhrase} sp-${curSection}-${curPhrase}`
    }, children, style } = this.props
    const { curSection, curPhrase } = this.state
    
    return (<div style={style} className={classNameFn(curSection, curPhrase)}>{children}</div>)
  }


  componentWillUnmount() {
    if (typeof window == 'undefined') {
      return
    }

    //清理绑定事件
    Object.keys(this._toClean).map((k) => {
      $(window).unbind(k, this._toClean[k])
    })
    this._timers.forEach(clearTimeout)
  }
}

export default ScrollClassName