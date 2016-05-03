<!---
Copyright 2016 The AMP HTML Authors. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS-IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

# MANTIS® Ad Network

Please visit our [website](https://www.mantisadnetwork.com) for more information about us. If you have an issues implementing these tags, please [contact us](http://www.mantisadnetwork.com/contact/).

## Examples

### Display Ads

Supported parameters:

- data-property
- data-zone

```html
<amp-ad width=300 height=250
    type = "mantis-display"
    data-property = "demo"
    data-zone="medium-rectangle">
</amp-ad>
```

### Content Recommendation

Supported parameters:

- data-property
- data-css (Overrides the default CSS embedded by the script)

Depending on your page design, you may need to play with the "heights=" parameter to ensure the styling works for your layout.

```html
  <amp-embed width=100 height=283
             type="mantis-recommend"
             layout=responsive
             heights="(min-width:1907px) 56%, (min-width:1100px) 64%, (min-width:780px) 75%, (min-width:480px) 105%, 200%"
             data-property="demo">
  </amp-embed>
``

### MANTIS.Video

Supported parameters:

- data-property
- data-video

If there are videos from MANTIS.Video that you would like to embed within your page, refer to the embed section of that video's page. Here is an example:

```html
  <amp-embed width=512 height=288
             type="mantis-video"
             layout=responsive
             data-video="56550a151fbad483c946adaa"
             data-property="demo">
  </amp-embed>
```