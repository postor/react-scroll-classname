# react-scroll-classname

change classname when user scroll (wheel/touch)

## why this project

any animation / show hide based on scroll, when you use css to controll animation, you can controll more things when you want to make something like

- full page scroll like iscroll
- parallax scrolling like parallax.js
- auto hide menu bar when scroll down and show it when scroll up

# usage

install with npm 

```
npm install react-scroll-classname --save
```

in your react component

```
import ScrollClassName from 'react-scroll-classname'

export default () => {
  return (<ScrollClassName sections={[[
    {
      duration: 1000,
    },
    {
      duration: 1000,
      autoNext: true,
    },
  ],[
    {
      duration: 1000,
      autoPrev: true,
    },
    {
      duration: 1000,
    },
  ]]} classNameFn={(a,b)=>`s${a} p${b}`}>
    <div className="section section1">
      <div className="phrase phrase1">section1-phrase1</div>
      <div className="phrase phrase2">section1-phrase2</div>
    </div>
    <div className="section section2">
      <div className="phrasephrase1">section2-phrase1</div>
      <div className="phrase phrase2">section2-phrase2</div>
    </div>
  </ScrollClassName>)
}

```

in your css

```
.section,.phrase {
  opacity: 0;
  transistion: 1s;
}

.s1 section1, .s2 section2, .p1 phrase1, .p2 phrase2 {
  opacity: 1;
}

```

then scroll on the page