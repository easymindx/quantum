import gsap from 'gsap';
let texIndex = 0;

const scroll = (con, h, material, tex) => {
  const height = con[0].getBoundingClientRect().height;
  const H = h.getBoundingClientRect();
  const limit = H.height - height;

  let move = 0;
  let mY = 0;
  document.addEventListener('mousemove', (e) => {
    if (e.buttons === 1) {
      if (e.pageY < mY) {
        if (-move < limit) {
          move -= 15;
        } else {
          move = move;
        }
      } else {
        if (move < 0) {
          move += 15;
        } else {
          move = move;
        }
      }
      mY = e.pageY;
      let j = Math.abs(Math.round(move / height));

      for (let index = 0; index < con.length; index++) {
        const element = con[index];
        if (index === j) {
          texIndex = index;
          element.classList.remove('outline');
          if (element.classList.contains('none')) {
            element.classList.remove('none');
          }
          gsap.fromTo(
            material.uniforms.uStatic,
            {
              value: Math.PI,
            },
            {
              value: 0,
              duration: 0.4,
            }
          );

          material.uniforms.uTexture.value = tex[index];
        } else {
          element.classList.add('outline');
        }
      }
      gsap.to(h, {
        y: move,
        duration: 0.9,
        ease: 'power2',
      });
    }
  });
};

export { scroll, texIndex };
