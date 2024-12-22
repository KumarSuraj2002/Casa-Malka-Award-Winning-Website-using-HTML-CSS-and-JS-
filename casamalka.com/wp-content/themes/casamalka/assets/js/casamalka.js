$(function () {
  "use strict";
  var t = $("#main"),
    e = {
      debug: !1,
      trigger_container: $(document),
      anchors: "a[href]",
      scroll: !1,
      blacklist:
        '.no-transition, .no-smoothState, [href^="mailto:"], [target="_blank"], [href^="#"], [download], [href^="tel:"], a[tequila]',
      cacheLength: 0,
      prefetch: !1,
      onBefore: function (t, e, o) {
        Website.transition._init({ $trigger: t, destination: o });
      },
      onReady: {
        render: function (t, e, o, i, n) {
          Website.transition.queue(e, i, n);
        },
      },
    };
  (Website._smoothState = t.smoothState(e).data("smoothState")),
    Website._init(!0);
});
var Website = {
    _register: {
      breakpoints: {},
      controllers: [],
      transition: {
        container: $("#main"),
        current: 0,
        history: {},
        timer: { duration: 0, interval: !1, timer: !1 },
        transitioned: !1,
      },
    },
    _init: function (t, e) {
      Website.resize._init(!0),
        setTimeout(() => {
          this.base(t, e), this.controllers(t);
        }, 100),
        t && this.events();
    },
    base: function (t, e) {
      t &&
        ($.each(
          [
            "touch",
            "notouch",
            "mobile",
            "tablet",
            "laptop",
            "desktop",
            "laptop_lg_desktop",
            "laptop_desktop",
            "laptop_desktop_notouch",
          ],
          function (t, e) {
            $("body").append('<code class="device" id="_' + e + '"></code>'),
              (Website._register.breakpoints[e] = !!$("#_" + e + ":visible")
                .length);
          }
        ),
        (Website._register.orientation =
          90 == Math.abs(window.orientation) ? "landscape" : "portrait"),
        setTimeout(() => {
          $("body").addClass("ready");
        }, 100));
      let o =
        /^((?!chrome|android|iphone|ipad).)*safari/i.test(
          navigator.userAgent.toLowerCase()
        ) && window.innerWidth > 1200;
      document.body.classList.toggle("safari", o),
        (Website.wrapper = o
          ? document.body
          : document.getElementById("scrollWrapper")),
        (lenis = new Lenis({
          wrapper: Website.wrapper,
          content: document.getElementById(o ? "main" : "scrollWrapper"),
          duration: 1.2,
          easing: (t) => (1 === t ? 1 : 1 - Math.pow(2, -10 * t)),
        })),
        (Website._register.raf = (t) => {
          lenis.raf(t), requestAnimationFrame(Website._register.raf);
        }),
        requestAnimationFrame(Website._register.raf),
        gsap.registerPlugin(CSSRulePlugin),
        ScrollTrigger.defaults({
          scroller: Website.wrapper,
          invalidateOnRefresh: !0,
          scrub: !0,
        }),
        setTimeout(() => {
          Website.resize._init(!0),
            setTimeout(() => {
              Website.resize._init(!0);
            }, 800);
          let t = window.history.state.uid || "0",
            e = Website._register.transition.history[t] || 0;
          lenis.scrollTo(e, { force: !0, immediate: !0 });
        }, 100);
    },
    controllers: function (t) {
      (Website._register.controllers = [
        "Global",
        "Components",
        "Cart",
        "Analytics",
      ]),
        $("[controller]").each(function () {
          var t = $(this)
            .attr("controller")
            .replace(/-/g, " ")
            .replace(/\w\S*/g, function (t) {
              return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase();
            })
            .replace(/ /g, "");
          "object" == typeof window[t] &&
            -1 == $.inArray(t, Website._register.controllers) &&
            Website._register.controllers.push(t);
        }),
        Website._register.controllers.forEach((e) => {
          let o = window[e];
          o.hasOwnProperty("_register") || (o._register = {}),
            o.hasOwnProperty("_init")
              ? o._init(t)
              : (o.hasOwnProperty("base") && !o.hasOwnProperty("_") && o.base(),
                o.hasOwnProperty("setup") &&
                  Object.keys(o.setup).forEach((t) => {
                    "function" == typeof o.setup[t] &&
                      setTimeout(() => {
                        o.setup[t]();
                      }, 100);
                  }),
                o.hasOwnProperty("events") && o.events(),
                o.hasOwnProperty("scroll") &&
                  Object.keys(o.scroll).forEach((t) => {
                    "function" == typeof o.scroll[t] &&
                      setTimeout(() => {
                        o.scroll[t]();
                      }, 100);
                  }));
        });
    },
    events: function (t) {
      $(document).bind("wheel touchstart", function (t) {
        $("html, body").stop();
      }),
        $(window).on("resize", function () {
          Website.resize._init(!1);
        }),
        $(window).on("beforeunload", function () {
          $(window).scrollTop(0);
        });
    },
    resize: {
      _init: function (t) {
        if (
          document.documentElement.clientWidth >= 1025 ||
          Math.max(document.documentElement.clientWidth, 320) !=
            Website._register.width
        ) {
          Website._register.width = Math.max(
            document.documentElement.clientWidth,
            320
          );
          let e = 0.01 * window.innerHeight;
          document.documentElement.style.setProperty("--vh_fixed", `${e}px`);
        }
        let o = 0.01 * window.innerHeight;
        document.documentElement.style.setProperty("--vh", `${o}px`);
        let i = 0.01 * window.innerHeight;
        document.documentElement.style.setProperty("--vvh", `${i}px`);
        let n =
          0.01 *
          (clientWidth = Math.max(document.documentElement.clientWidth, 320));
        document.documentElement.style.setProperty("--vw", `${n}px`),
          Website._register.hasOwnProperty("vw") ||
            ((Website._register.vw = !0),
            setTimeout(() => ScrollTrigger.refresh(), 200)),
          document.documentElement.style.setProperty(
            "--vwx100",
            `${clientWidth}px`
          );
        let r = window.innerWidth - clientWidth;
        document.documentElement.style.setProperty("--sw", `${r}px`),
          document.body.classList.toggle("touch-device", is_touch_device());
        let a = 90 == Math.abs(window.orientation) ? "landscape" : "portrait";
        (a == Website._register.orientation &&
          Website._register.breakpoints.touch) ||
          (setTimeout(() => {
            ScrollTrigger.refresh();
          }, 100),
          (Website._register.orientation = a)),
          $.each(
            [
              "touch",
              "notouch",
              "mobile",
              "tablet",
              "laptop",
              "desktop",
              "laptop_lg_desktop",
              "laptop_desktop",
              "laptop_desktop_notouch",
            ],
            function (t, e) {
              Website._register.breakpoints[e] = !!$("#_" + e + ":visible")
                .length;
            }
          ),
          $.each(Website._register.controllers, function (t, e) {
            window[e].hasOwnProperty("resize") &&
              Object.keys(window[e].resize).forEach((t) => {
                "function" == typeof window[e].resize[t] &&
                  window[e].resize[t]();
              });
          });
      },
    },
    transition: {
      _init: function (t = {}) {
        let {
          popstate: e = null,
          $trigger: o = null,
          destination: i = null,
          transition_class: n = null,
          custom_transition: r = null,
        } = t;
        this.unload(),
          t.custom_transition || $("body").addClass(`transition ${n}`);
      },
      begin_transition: function () {
        (Website._register.transition.timer.duration = 0),
          (Website._register.transition.timer.interval = setInterval(() => {
            Website._register.transition.timer.duration += 1;
          }, 1));
      },
      queue: function (t, e, o) {
        Website._register.transition.timer.end = setTimeout(() => {
          Website.transition.end._init(t, e, o),
            clearInterval(Website._register.transition.timer.interval);
        }, Math.max(500 - Website._register.transition.timer.duration, 0));
      },
      end: {
        _init: function (t, e, o) {
          lenis.destroy(),
            ScrollTrigger.killAll(),
            gsap.killTweensOf("*"),
            Global.functions.carousels.destroy(),
            Website._register.transition.container.html(t),
            this.content(o.replace(location.origin + "/", "")),
            this.restore(o.replace(location.origin + "/", ""));
        },
        content: function (t) {
          gsap.utils.toArray("div.tequila-page.active").forEach((t) => {
            let e = document.querySelector("div.page section.tequila-hero");
            e && (e.classList.add("unmasked"), t.classList.remove("active"));
          });
        },
        restore: function (t) {
          Website._register.transitioned = !0;
          let e = document.body.classList.contains("transition")
            ? "ready transition"
            : "ready";
          document.body.setAttribute("class", e),
            setTimeout(() => {
              document.body.classList.remove("transition");
            }, 400),
            lenis.isStopped && lenis.start(),
            lenis.scrollTo(0, { force: !0, immediate: !0 }),
            setTimeout(() => {
              Website._init(!1);
            }, 1);
        },
      },
      unload: function () {
        Website.unload(),
          clearTimeout(Website._register.transition.timer.interval),
          clearTimeout(Website._register.transition.timer.end),
          $("input").blur();
      },
    },
    unload: function () {
      $(document).off(".page"),
        $.each(Website._register.controllers, function (t, e) {
          "object" == typeof window[e] &&
            window[e].hasOwnProperty("unload") &&
            window[e].unload();
        });
    },
  },
  Animations = {
    _register: { images: [], videos: [] },
    _init: function () {
      Object.keys(Animations.loadin).forEach((t) => {
        setTimeout(() => {
          Animations.loadin[t]();
        }, 100);
      }),
        Object.keys(Animations.hover).forEach((t) => {
          setTimeout(() => {
            Animations.hover[t]();
          }, 100);
        }),
        Object.keys(Animations.scroll).forEach((t) => {
          setTimeout(() => {
            Animations.scroll[t]();
          }, 200);
        }),
        setTimeout(() => {
          this.videos.init();
        }, 100);
    },
    loadin: {},
    hover: {},
    scroll: {
      fixed: function () {
        gsap.utils.toArray('[scroll*="fixed"]').forEach((t) => {
          ScrollTrigger.create({
            trigger: t,
            start: "top bottom",
            end: "bottom top",
            onEnter() {
              t.classList.add("fixed");
            },
            onLeaveBack() {
              t.classList.remove("fixed");
            },
            onLeave() {
              t.classList.add("lock");
            },
            onEnterBack() {
              t.classList.remove("lock");
            },
            onUpdate(e) {
              let o = Math.max(
                gsap.utils.mapRange(
                  0,
                  1,
                  0.4 * window.innerHeight,
                  0,
                  e.progress
                ),
                0
              );
              t.style.setProperty(
                "--translateY",
                `${o - 0.2 * window.innerHeight}px`
              );
            },
          });
        });
      },
      reveal: function () {
        gsap.utils.toArray('[scroll*="reveal"]').forEach((t) => {
          if (t.revealed) return;
          let e = String(
            window.getComputedStyle(t).getPropertyValue("--scroll-start")
          ).trim();
          ScrollTrigger.create({
            trigger: t,
            start: e || "top bottom-=20px",
            once: !0,
            onEnter() {
              t.reveal_callback && t.reveal_callback(),
                t.classList.add("reveal"),
                (t.revealed = !0);
            },
          });
        });
      },
      text_reveal: function () {
        gsap.utils.toArray(".text-reveal:not(.set)").forEach((t) => {
          let e = 0;
          t.innerHTML = t.innerHTML.replace(/([^<>]+)(?=<|$)/g, function (o) {
            let i = document.createElement("textarea");
            return (
              (i.innerHTML = o),
              (html = i.value).replace(/([^\s]+)(?=\s|$)/g, function (o) {
                return `<reveal-outer style="--index:${++e}"><reveal-inner><reveal-content>${(o =
                  t.hasAttribute("split-letters")
                    ? o
                        .split("")
                        .map((t) => `<char>${t}</char>`)
                        .join("")
                    : o)}</reveal-content></reveal-inner></reveal-outer>`;
              })
            );
          });
        });
      },
    },
    videos: {
      init: function () {
        Animations._register.videos.forEach((t) => t.kill(!1)),
          (Animations._register.videos = []),
          this.autoplay(),
          this.autoplay_fixed(),
          this.autopause();
      },
      autoplay: function () {
        gsap.utils
          .toArray(
            'video[scroll*="video"][autoplay]:not(.fixed):not(.custom-autoplay), video[scroll*="video"].autoplay:not(.fixed):not(.custom-autoplay)'
          )
          .forEach((t) => {
            let e = t.getAttribute("scroll-trigger")
                ? document.getElementById(t.getAttribute("scroll-trigger"))
                : t,
              o = ScrollTrigger.create({
                trigger: e,
                start: "top bottom",
                end: "bottom top",
                onEnter() {
                  setTimeout(() => {
                    $(e).is(":visible") && t.play();
                  }, 100);
                },
                onEnterBack() {
                  setTimeout(() => {
                    $(e).is(":visible") && t.play();
                  }, 100);
                },
                onLeave() {
                  t.pause();
                },
                onLeaveBack() {
                  t.pause();
                },
              });
            Animations._register.videos.push(o);
          });
      },
      autoplay_fixed: function () {
        gsap.utils
          .toArray(
            'video[scroll*="video"][autoplay].fixed:not(.custom-autoplay), video[scroll*="video"].autoplay.fixed:not(.custom-autoplay)'
          )
          .forEach((t) => {
            let e = ScrollTrigger.create({
              trigger: t.hasOwnProperty("video_parent")
                ? t.video_parent
                : t.parentElement,
              start: "top bottom",
              end: "bottom top",
              onEnter() {
                t.play();
              },
              onEnterBack() {
                t.play();
              },
              onLeave() {
                t.pause();
              },
              onLeaveBack() {
                t.pause();
              },
            });
            Animations._register.videos.push(e);
          });
      },
      autopause: function () {
        gsap.utils
          .toArray(
            'video[scroll*="video"]:not([autoplay]):not(.autoplay):not(.fixed):not(.custom-autoplay)'
          )
          .forEach((t) => {
            let e = t.getAttribute("scroll-trigger")
                ? document.getElementById(t.getAttribute("scroll-trigger"))
                : t,
              o = ScrollTrigger.create({
                trigger: e,
                start: "top bottom",
                end: "bottom top",
                onLeave() {
                  t.pause();
                },
                onLeaveBack() {
                  t.pause();
                },
              });
            Animations._register.videos.push(o);
          });
      },
    },
  },
  Analytics = {
    setup: {
      get_gtag_session: function () {
        window.gtag &&
          gtag("get", "G-XLSZMWFB9K", "session_id", (t) => {
            Analytics.gtag_session = t;
          });
      },
    },
    add_to_cart: function (t, e) {
      window.gtag &&
        gtag("event", "add_to_cart", {
          items: [
            {
              item_id: `shopify_US_${t.ProductID}_${t.VariantID}`,
              item_name: t.Name,
              item_brand: "Casa Malka",
              item_category: "Sales",
              price: parseInt(t.PriceFloat),
              quantity: e,
              item_variant: t.VariantName,
            },
          ],
          currency: "USD",
          value: t.PriceFloat,
        });
    },
    view_product: function (t) {
      window.gtag &&
        gtag("event", "view_item", {
          items: [
            {
              item_id: `shopify_US_${t.ProductID}_${t.VariantID}`,
              item_name: t.Name,
              item_brand: "Casa Malka",
              item_category: "Sales",
              price: parseInt(t.PriceFloat),
              quantity: 1,
              item_variant: t.VariantName,
            },
          ],
          currency: "USD",
          value: t.PriceFloat,
        });
    },
  },
  Global = {
    _register: {},
    setup: {
      responsive_linebreaks: function () {
        gsap.utils.toArray(".rlb").forEach((t) => {
          let e = document.createElement("textarea");
          (e.innerHTML = t.innerHTML), (html = e.value);
          for (let o = 0; o < 2; o++) {
            let i = document.createElement("code");
            (i.innerHTML = html), t.appendChild(i);
          }
          t.rlb = !0;
        }),
          Global.resize.responsive_linebreaks();
      },
    },
    base: function () {
      Animations._init(),
        this.functions.carousels.activate(),
        this.functions.cookies.show();
    },
    events: function () {
      $(document).on("click.page", 'button[action="menu.toggle"]', function () {
        Global.interaction.menu.toggle();
      }),
        $(document).on("keydown.page", "body.menu:not(.cart)", function (t) {
          "Escape" == t.key && Global.interaction.menu.toggle(!1);
        }),
        $(document).on(
          "click.page",
          'button[action="cookies.accept"]',
          function () {
            Global.functions.cookies.submit(!0);
          }
        ),
        $(document).on(
          "click.page",
          'button[action="cookies.decline"]',
          function () {
            Global.functions.cookies.submit(!1);
          }
        ),
        $(document).on(
          "click.page",
          'button[action="video.play"]',
          function () {
            Global.interaction.video.play(this);
          }
        ),
        $("video").on("loadedmetadata.page", function () {
          (this.loaded = !0),
            this.hasOwnProperty("callback") && this.callback();
        });
    },
    functions: {
      carousels: {
        activate: function () {
          this.hasOwnProperty("carousels") &&
            Object.keys(this.carousels).forEach((t) => {
              "function" == typeof this.carousels[t] && this.carousels[t]();
            });
        },
        destroy: function () {
          gsap.utils.toArray("div.splide").forEach((t) => {
            t.hasOwnProperty("splide") && t.splide.destroy();
          });
        },
        carousels: {
          recipes: function () {
            let t = document.querySelector("section.recipes.carousel");
            if (!t) return;
            let e = t.querySelector("div.splide");
            e.splide = new Splide(e, {
              type: "loop",
              drag: "free",
              focus: "left",
              arrows: !1,
              pagination: !1,
              autoWidth: !0,
              autoScroll: { pauseOnHover: !0, speed: 0.5 },
            }).mount(window.splide.Extensions);
          },
          social: function () {
            let t = document.querySelector("section.social");
            if (!t) return;
            let e = t.querySelector("a div.splide"),
              o = t.querySelector(":scope > div.splide");
            (e.splide = new Splide(e, {
              type: "loop",
              drag: !1,
              focus: "center",
              arrows: !1,
              pagination: !1,
              autoWidth: !0,
              clones: 10,
              autoScroll: { pauseOnHover: !1, speed: 0.5 },
            }).mount(window.splide.Extensions)),
              (o.splide = new Splide(o, {
                type: "loop",
                drag: "free",
                focus: "left",
                arrows: !1,
                pagination: !1,
                autoWidth: !0,
                autoScroll: { pauseOnHover: !1, speed: 0.5 },
              }).mount(window.splide.Extensions));
          },
          ticker: function () {
            gsap.utils.toArray("section.ticker div.splide").forEach((t) => {
              t.splide = new Splide(t, {
                type: "loop",
                drag: !1,
                focus: "center",
                arrows: !1,
                pagination: !1,
                autoWidth: !0,
                clones: 10,
                autoScroll: { pauseOnHover: !1, speed: 0.5 },
              }).mount(window.splide.Extensions);
            });
          },
        },
      },
      cookies: {
        show: function () {
          window.addEventListener(
            "CookiebotOnDialogDisplay",
            function (t) {
              setTimeout(() => {
                $("#cookiebanner").addClass("active");
              }, 1e3);
            },
            !1
          );
        },
        submit: function (t) {
          Cookiebot.submitCustomConsent(t, t, t),
            Cookiebot.getScript(
              "https://www.googletagmanager.com/gtag/js?id=G-QR4YTT06QW",
              !0
            ),
            Cookiebot.getScript(
              "https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=TR2KAX",
              !0
            ),
            $("#cookiebanner")
              .removeClass("active")
              .prop(
                "remove",
                setTimeout(() => {
                  $("#cookiebanner").remove();
                }, 400)
              );
        },
      },
      responsive_video: function () {
        let t = document.querySelector("video.responsive"),
          e = t.querySelectorAll("source");
        if (!t) return;
        let o = !1;
        for (let i of e)
          if (
            window.matchMedia(i.media).matches &&
            ((o = !0), t.currentSrc !== i.src)
          ) {
            (t.src = i.src), t.load(), t.play();
            break;
          }
        o ? o && t.paused && t.play() : t.pause();
      },
    },
    interaction: {
      menu: {
        toggle: function (t = null) {
          (t = null !== t ? t : !$("body").hasClass("menu")),
            clearTimeout($("body").prop("menu-animation")),
            $("body")
              .toggleClass("menu", t)
              .addClass("menu-animation")
              .prop(
                "menu-animation",
                setTimeout(() => {
                  $("body").removeClass("menu-animation");
                }, 400)
              ),
            clearTimeout($("#menu").prop("animate")),
            $("#menu")
              .addClass("animate")
              .prop(
                "animate",
                setTimeout(() => {
                  $("#menu").removeClass("animate");
                }, 1e3)
              ),
            lenis[t ? "stop" : "start"]();
        },
      },
      video: {
        play: function (t) {
          let e = t.previousElementSibling;
          (e.setCurrentTime = 0), e.play(), e.classList.add("playing");
        },
      },
    },
    resize: {
      responsive_video: function () {
        $("video.responsive").length && Global.functions.responsive_video();
      },
      responsive_linebreaks: function () {
        gsap.utils.toArray(".rlb").forEach((t) => {
          if (!t.rlb) return;
          let e = t.querySelectorAll("code");
          t.classList.toggle("lb", e[0].offsetHeight == e[1].offsetHeight);
        });
      },
      scrolltrigger: function () {
        Website._register.width != window.innerWidth &&
          ((Website._register.width = window.innerWidth),
          clearTimeout(Global._register.scrolltrigger_refresh),
          (Global._register.scrolltrigger_refresh = setTimeout(() => {
            ScrollTrigger.refresh();
          }, 100)));
      },
    },
  },
  Components = {
    setup: {
      heading: function () {
        gsap.utils.toArray("div.heading").forEach((t) => {
          let e = Object.assign(document.createElement("span"), {
            className: "border",
          });
          t.appendChild(e);
        });
      },
      shop: function () {
        let t = document.querySelector("section.shop");
        if (!t) return;
        let e = t.querySelector("div.splide:first-child"),
          o = t.querySelector("div.splide:last-child");
        (e.splide = new Splide(e, {
          type: "fade",
          drag: !1,
          focus: "left",
          easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
          speed: 400,
          arrows: !1,
          pagination: !1,
          autoWidth: !0,
        })),
          (o.splide = new Splide(o, {
            type: "loop",
            drag: !1,
            focus: "left",
            easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
            speed: 400,
            arrows: !0,
            pagination: !1,
            autoWidth: !0,
          })),
          e.splide.sync(o.splide),
          e.splide.mount(),
          o.splide.mount();
      },
      tequila_highlights: function () {
        let t = document.querySelector("section.tequila-highlights");
        if (!t) return;
        let e = t.querySelector("div.splide"),
          o = e.querySelectorAll("li.splide__slide");
        o.length > 3 &&
          (e.splide = new Splide(e, {
            type: "loop",
            drag: !0,
            focus: "left",
            arrows: !0,
            pagination: !1,
            autoWidth: !0,
            breakpoints: { 767: { destroy: !0 } },
          }).mount());
      },
    },
    events: function () {
      $(document).on(
        "click.page",
        'button[action="accordion.toggle"]',
        function () {
          Components.interaction.accordion.toggle($(this));
        }
      ),
        $(document).on(
          "click.page",
          'button[action="agegate.accept"]',
          function () {
            Components.interaction.agegate.accept();
          }
        ),
        $(document).on(
          "click.page",
          'button[action="dropdown.toggle"]',
          function () {
            Components.interaction.dropdown.toggle($(this));
          }
        ),
        $(document).on("click.page", "div.dropdown input", function (t) {
          Components.interaction.dropdown.select($(this), t);
        }),
        $(document).on("click.page", "div.dropdown", function (t) {
          t.stopPropagation();
        }),
        $(document).on("click.page", "body.dropdown-active", function () {
          Components.interaction.dropdown.close();
        }),
        $(document).on(
          "click.page",
          'button[action="details.toggle"]',
          function () {
            Components.interaction.details(this);
          }
        );
    },
    interaction: {
      accordion: {
        toggle: function (t) {
          clearTimeout(
            ($accordion = t.parents("accordion-element")).prop("animate")
          ),
            clearTimeout($accordion.prop("activate")),
            this[$accordion.hasClass("active") ? "deactivate" : "activate"](
              $accordion
            );
        },
        activate: function (t) {
          clearTimeout(t.prop("activate")),
            clearTimeout(t.prop("animate")),
            t
              .addClass("animate active-content")
              .find("accordion-inner")
              .css("height", getHeight(t.find("accordion-content")))
              .end()
              .prop(
                "activate",
                setTimeout(() => {
                  t.addClass("active");
                }, 1)
              )
              .prop(
                "animate",
                setTimeout(() => {
                  t
                    .removeClass("animate")
                    .find("accordion-inner")
                    .removeAttr("style"),
                    ScrollTrigger.refresh();
                }, 601)
              ),
            t.find("video").each(function (t, e) {
              e.play();
            }),
            t.find("div.splide").each(function (t, e) {
              e.splide.Components.Move.jump(0);
            }),
            !t.parents("accordion-container").is("[multiple]") &&
              (t.parents("accordion-container").length
                ? t
                    .parents("accordion-container")
                    .find("accordion-element.active")
                : t.siblings(".active")
              ).each(function () {
                Components.interaction.accordion.toggle(
                  $(this).find('button[action="accordion.toggle"]')
                );
              });
          let e = getTop(t.parents("accordion-container")) + 1;
          t.prevAll("accordion-element").each(function () {
            e +=
              getHeight($(this).find('button[action="accordion.toggle"]')) + 1;
          }),
            !t.parents("accordion-container").is("[multiple]") &&
              e < window.scrollY + 38 &&
              $("html, body").animate({ scrollTop: e - 38 }, 400);
        },
        deactivate: function (t) {
          t
            .find("accordion-inner")
            .css("height", getHeight(t.find("accordion-content"))),
            t.find("video").each(function (t, e) {
              e.pause();
            }),
            t.prop(
              "activate",
              setTimeout(() => {
                t.addClass("animate deactivate")
                  .removeClass("active")
                  .find("accordion-inner")
                  .removeAttr("style");
              }, 10)
            ),
            t.prop(
              "animate",
              setTimeout(() => {
                t.removeClass("animate deactivate active-content"),
                  ScrollTrigger.refresh();
              }, 830)
            );
        },
      },
      agegate: {
        accept: function () {
          let t = document.getElementById("age-gate"),
            e = t.querySelector("div.container"),
            o = e.offsetHeight + (window.innerHeight - e.offsetHeight) / 2 + 1;
          t.style.setProperty("--top", `${o}px`),
            t.classList.add("accept"),
            setTimeout(() => {
              t.remove();
            }, 600),
            t.hasOwnProperty("onComplete") && t.onComplete(),
            fetch("/wp-json/api/general/age");
        },
      },
      dropdown: {
        toggle: function (t) {
          let e = t.parents("div.dropdown");
          this.close(e),
            e
              .toggleClass("active")
              .find("div.dropdown-container div")
              .scrollTop(0),
            $("body").toggleClass("dropdown-active", e.hasClass("active"));
        },
        close: function (t) {
          $("div.dropdown").not(t).removeClass("active"),
            $("body").removeClass("dropdown-active");
        },
        reset: function (t) {
          let e = t.find('button[action="dropdown.toggle"]'),
            o = e.find("span"),
            i = t.find("div.dropdown-container label:first-child");
          t.removeClass("selected")
            .parents("fieldset")
            .removeClass("selected-active")
            .end()
            .find(o)
            .text(e.attr("aria-label"))
            .end()
            .find(i)
            .addClass("active")
            .siblings()
            .removeClass("active");
        },
        select: function (t, e) {
          let o = t.parents("div.dropdown"),
            i = o.next("select"),
            n = o.find("input:checked"),
            r = n.next("span").text();
          t
            .parent("label")
            .toggleClass("active")
            .siblings()
            .removeClass("active"),
            o
              .toggleClass("selected", !!r)
              .parents("fieldset")
              .toggleClass(
                "selected-active",
                !!n.parents("label").prevAll().length
              )
              .end()
              .find('button[action="dropdown.toggle"] span')
              .text(r),
            i.val(n.val()),
            this.toggle(t);
        },
      },
      details: function (t) {
        let e = t.parentElement,
          o = e.parentElement;
        o.classList.contains("activating") ||
          (o.querySelectorAll(":scope > li").forEach((t) => {
            t === e
              ? (t.classList.toggle("active"),
                t.classList.contains("active") &&
                  (t.querySelector("div.details").scrollTop = 0))
              : t.classList.contains("active") && t.classList.remove("active");
          }),
          clearTimeout(o.activating),
          (o.activating = setTimeout(() => {
            o.classList.remove("activating");
          }, 400)));
      },
    },
    resize: {
      recipes: function () {
        gsap.utils.toArray("section.recipes").forEach((t) => {
          let e = t.querySelector("div.heading"),
            o = t.querySelector("ul.expandable"),
            i = Math.max(
              ...[...o.querySelectorAll("li button")].map((t) => t.offsetHeight)
            );
          t.style.setProperty("--heading", `${e.offsetHeight}px`),
            t.style.setProperty("--button-height", `${i}px`);
        });
      },
      shop: function () {
        gsap.utils.toArray("section.shop").forEach((t) => {
          let e = t.querySelector("div.heading");
          t.style.setProperty("--heading", `${e.offsetHeight}px`),
            gsap.utils
              .toArray('li button[action="details.toggle"]')
              .forEach((t) => {
                let e = t.closest("li");
                e.style.setProperty("--button-height", `${t.offsetHeight}px`);
              });
        });
      },
    },
    scroll: {
      shop: function () {
        let t = document.querySelector("header"),
          e = document.querySelector("section.shop");
        e &&
          (e.querySelector("div.heading"),
          ScrollTrigger.create({
            trigger: e,
            start: () => `top top+=${t.offsetHeight}px`,
            end: () => `bottom top+=${t.offsetHeight}px`,
            onEnter() {
              e.classList.add("sticky");
            },
            onLeaveBack() {
              e.classList.remove("sticky");
            },
            onLeave() {
              e.classList.add("stuck");
            },
            onEnterBack() {
              e.classList.remove("stuck");
            },
          }));
      },
    },
  },
  Homepage = {
    _register: {},
    setup: {
      age_gate: function () {
        let t = document.getElementById("age-gate");
        t && (lenis.stop(), (t.onComplete = Homepage.functions.load));
      },
      splash: function () {
        document.getElementById("age-gate") || Homepage.functions.load();
      },
    },
    events: function () {
      $(document).on(
        "click.page",
        "section.homepage-tequila a[tequila]",
        function (t) {
          Homepage.interaction.tequila(this), t.preventDefault();
        }
      );
    },
    unload: function () {},
    functions: {
      load: function () {
        let t = document.querySelector("header"),
          e = document.getElementById("homepage-hero"),
          o = document.getElementById("homepage-hero-text"),
          i = o.querySelector("div#hero-taglines");
        Website._register.transitioned
          ? (t.classList.remove("splash"),
            setTimeout(() => {
              e.classList.add("reveal"),
                i.classList.add("reveal"),
                this.bottle_reveal();
            }, 300))
          : (lenis.stop(),
            t.classList.add("splash-animation"),
            setTimeout(() => {
              t.classList.add("splash-2");
            }, 1e3),
            setTimeout(() => {
              t.classList.remove("splash", "splash-2"),
                e.classList.add("reveal"),
                i.classList.add("reveal");
            }, 1800),
            setTimeout(() => {
              t.classList.remove("splash-animation"), lenis.start();
            }, 2400),
            setTimeout(() => {
              Homepage.functions.bottle_reveal();
            }, 1700));
      },
      bottle_reveal: function () {
        let t = document.getElementById("homepage-hero"),
          e = t.querySelector("figure#blanco-bottle"),
          o = e.querySelectorAll("img"),
          i = 15,
          n = { image: i };
        o[i].classList.add("active"),
          gsap.to(n, {
            image: 77,
            duration: 2,
            ease: "power4.out",
            onUpdate() {
              i > 74 ||
                (o[i].classList.remove("active"),
                o[(i = Math.floor(n.image))].classList.add("active"));
            },
          });
      },
    },
    interaction: {
      tequila: function (t) {
        document.querySelector("header");
        let e = t.closest("div.card"),
          o = getTop(e) + e.offsetHeight - window.innerHeight,
          i = t.getAttribute("tequila"),
          n = document.getElementById(`${i}-page`);
        lenis.scrollTo(o, {
          duration: 0.6,
          easing: (t) => --t * t * t + 1,
          lock: !0,
          onComplete() {
            lenis.stop(),
              n.classList.add("active"),
              Website.transition._init({ custom_transition: !0 }),
              Website._smoothState.load(t.getAttribute("href"));
          },
        });
      },
    },
    resize: {
      hero: function () {
        let t = document.getElementById("homepage-hero");
        if (!t) return;
        let e = t.querySelector("h1"),
          o = e.querySelector("reveal-outer:last-child");
        o && e.style.setProperty("--width", `${o.offsetWidth}px`);
      },
      card: function () {
        gsap.utils.toArray("div.card").forEach((t) => {
          let e = t.querySelector("section");
          t.style.setProperty("--height", `${e.offsetHeight}px`);
        });
      },
    },
    scroll: {
      hero_bottle: function () {
        let t = document.querySelector("header"),
          e = document.getElementById("homepage-hero"),
          o = e.querySelector("figure#blanco-bottle");
        ScrollTrigger.create({
          trigger: e,
          start: "top top",
          end: () => `bottom-=${t.offsetHeight}px top`,
          onUpdate(t) {
            let e = gsap.utils.pipe(
                gsap.utils.clamp(0, 1),
                gsap.utils.mapRange(0, 1, 1, 76),
                gsap.utils.snap(1)
              )(t.progress),
              i = o.querySelector(`:scope > img:nth-of-type(${e})`);
            i.classList.add("active"),
              [...o.children].forEach(
                (t) => t !== i && t.classList.remove("active")
              );
          },
          onLeave() {
            e.classList.add("locked");
          },
          onEnterBack() {
            e.classList.remove("locked");
          },
        });
      },
      hero_out: function () {
        setTimeout(() => {
          let t = document.getElementById("homepage-hero"),
            e = t.querySelector("h1"),
            o = e.querySelectorAll("reveal-content"),
            i = document.getElementById("homepage-hero-text"),
            n = i.querySelector("div#hero-taglines div:first-child");
          gsap
            .timeline({
              scrollTrigger: {
                trigger: t,
                start: "top top",
                end: "center top",
                onUpdate(e) {
                  let o = Math.max(
                      gsap.utils.mapRange(0, 1, 12, 18, e.progress),
                      0
                    ),
                    i = Math.max(
                      gsap.utils.mapRange(0, 1, 14, 22, e.progress),
                      0
                    );
                  t.style.setProperty("--bottle-top-mobile", `${o}rem`),
                    t.style.setProperty("--bottle-top-tablet", `${i}rem`);
                },
              },
            })
            .fromTo(
              o,
              { y: 0 },
              {
                y: "100%",
                stagger: -0.05,
                ease: "cubic-bezier(0.7, 0, 0.84, 0)",
              },
              0
            )
            .fromTo(n, { opacity: 1, y: 0 }, { opacity: 0, y: "-50%" }, 0);
        }, 100);
      },
      blanco_in: function () {
        let t = document.querySelector("header"),
          e = document.getElementById("homepage-hero"),
          o = e.querySelector("figure#blanco-bottle"),
          i = o.querySelector("span"),
          n = document.getElementById("homepage-hero-text"),
          r = n.querySelector("div#hero-taglines div:last-child"),
          a = document.getElementById("homepage-blanco"),
          s = a.querySelector("div.tequila-text");
        setTimeout(() => {
          let o = n.querySelectorAll("div.heading h2:first-child reveal-inner"),
            l = {
              trigger: e,
              start: "center top",
              end: () => `bottom-=${t.offsetHeight}px top`,
              onUpdate(t) {
                a.classList.toggle("active", t.progress >= 0.5);
              },
              onLeave() {
                a.classList.add("complete");
              },
              onEnterBack() {
                a.classList.remove("complete");
              },
            },
            c = gsap
              .timeline()
              .fromTo(
                i,
                { scaleX: 0, transformOrigin: "left" },
                { scaleX: 1 },
                0
              )
              .fromTo(o, { y: "100%" }, { y: 0 }, 0)
              .fromTo(r, { opacity: 0, y: "50%" }, { opacity: 1, y: 0 }, 0);
          ScrollTrigger.matchMedia({
            "(max-width: 767px)": function () {
              (l.animation = c.fromTo(
                s,
                { opacity: 0 },
                { opacity: 1, ease: "power3.out" },
                0
              )),
                ScrollTrigger.create(l);
            },
            "(min-width: 768px)": function () {
              (l.animation = c.fromTo(
                s,
                { opacity: 0 },
                { opacity: 1, ease: "power4.in" },
                0
              )),
                ScrollTrigger.create(l);
            },
          });
        }, 100);
      },
      blanco_out: function () {
        let t = document.querySelector("header"),
          e = document.getElementById("card-blanco"),
          o = document.getElementById("homepage-blanco"),
          i =
            (o.querySelector("div.heading span.border"),
            o.querySelector("div.heading")),
          n = o.querySelector("div.tequila-text");
        gsap
          .timeline({
            scrollTrigger: {
              trigger: e,
              start: () => `top-=${t.offsetHeight}px top`,
              end() {
                let t = n.getBoundingClientRect().top;
                return `bottom top+=${t}px`;
              },
              onUpdate(t) {
                o.classList.toggle("active", t.progress < 0.8);
              },
            },
          })
          .fromTo(
            n.children,
            { opacity: 1 },
            { opacity: 0, ease: "power3.in" },
            0
          ),
          gsap
            .timeline({
              scrollTrigger: {
                trigger: e,
                start: () => "bottom center",
                end: () => `bottom-=${t.offsetHeight}px top`,
              },
            })
            .fromTo(i, { opacity: 1 }, { opacity: 0 }, 0);
      },
      reposado_in: function () {
        let t = document.querySelector("header"),
          e = document.getElementById("homepage-hero"),
          o = e.querySelector("figure#reposado-bottle"),
          i = o.querySelector("div");
        o.querySelector("span");
        let n = document.getElementById("homepage-hero-text");
        n.querySelector("div.heading");
        let r = document.getElementById("card-reposado"),
          a = r.querySelector("div.tequila-text");
        ScrollTrigger.create({
          trigger: r,
          start: () =>
            `top-=${(bottle_bottom = o.getBoundingClientRect().bottom)}px top`,
          end: () =>
            `top-=${(bottle_top = o.getBoundingClientRect().top)}px top`,
          onEnter() {
            i.style.setProperty("opacity", 1);
          },
          onUpdate(t) {
            gsap
              .timeline()
              .to(i, {
                clipPath: `polygon(0% ${(1 - t.progress) * 100}%, 100% ${
                  (1 - t.progress) * 100
                }%, 100% 100%, 0 100%)`,
                duration: 0,
              });
          },
        });
        let s = {
          trigger: r,
          onEnter() {
            r.classList.add("sticky");
          },
          onLeaveBack() {
            r.classList.remove("sticky");
          },
          onUpdate(t) {
            r.classList.toggle("active", t.progress >= 0.5);
          },
          animation: gsap
            .timeline()
            .fromTo(a, { opacity: 0 }, { opacity: 1, ease: "power2.inOut" }, 0),
        };
        ScrollTrigger.matchMedia({
          "(max-width: 767px)": function () {
            (s.start = () => `top-=${t.offsetHeight}px bottom`),
              (s.end = () => `top-=${t.offsetHeight}px top`),
              ScrollTrigger.create(s);
          },
          "(min-width: 768px)": function () {
            (s.start = () => `top-=${t.offsetHeight}px top`),
              (s.end = () => `center-=${t.offsetHeight}px top`),
              ScrollTrigger.create(s);
          },
        }),
          setTimeout(() => {
            let o = n.querySelector(
                "div.heading h2:first-child reveal-outer:last-child reveal-content"
              ),
              i = n.querySelector(
                "div.heading h2:last-child reveal-outer:last-child reveal-inner"
              );
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: r,
                  start: () => `top-=${t.offsetHeight}px center`,
                  end: () => `top-=${t.offsetHeight}px top`,
                  onUpdate(t) {
                    e.classList.toggle("reposado", t.progress >= 0.2);
                  },
                },
              })
              .fromTo(o, { y: 0 }, { y: "-100%" }, 0)
              .fromTo(i, { y: "100%" }, { y: 0 }, 0);
          }, 100);
      },
      reposado_out: function () {
        let t = document.querySelector("header"),
          e = document.getElementById("card-reposado"),
          o = document.getElementById("homepage-reposado"),
          i = o.querySelector("div.tequila-text");
        gsap.timeline({
          scrollTrigger: {
            trigger: e,
            start: () => `top-=${t.offsetHeight}px top`,
            end() {
              let t = getTop(i) + i.offsetHeight - getTop(e);
              return `bottom top+=${t}px`;
            },
            onUpdate(t) {
              o.classList.toggle("active", t.progress < 0.8);
            },
          },
        });
      },
      video: function () {
        let t = document.querySelector("header"),
          e = document.getElementById("homepage-video-card"),
          o = e.querySelector("div.block"),
          i = e.querySelector("figure");
        gsap
          .timeline({
            scrollTrigger: {
              trigger: e,
              start: () => `top-=${t.offsetHeight}px bottom`,
              end: () => "bottom bottom",
            },
          })
          .fromTo(
            i,
            { clipPath: "inset(15%)" },
            { clipPath: "inset(0%)", duration: 1, ease: "none" },
            0
          );
        let n = gsap.timeline({
          scrollTrigger: {
            trigger: e,
            start: () => `top-=${t.offsetHeight}px top`,
            end: () => "bottom bottom",
            onLeave() {
              e.classList.add("complete");
            },
            onEnterBack() {
              e.classList.remove("complete");
            },
          },
        });
        o && n.fromTo(o, { opacity: 0 }, { opacity: 1, ease: "none" });
      },
      statement: function () {
        let t = document.querySelector("header"),
          e = document.getElementById("homepage-statement-card"),
          o = e.querySelector("div.container"),
          i = e.querySelector("figure"),
          n = e.querySelectorAll("div.container :is(blockquote, small)");
        gsap
          .timeline({
            scrollTrigger: {
              trigger: e,
              start: () => `top-=${t.offsetHeight}px bottom`,
              end: () => `bottom top-=${t.offsetHeight}px`,
              onEnter() {
                e.classList.add("locked");
              },
              onLeaveBack() {
                e.classList.remove("locked");
              },
            },
          })
          .fromTo(i, { rotation: -25 }, { rotation: 25, ease: "none" }, 0)
          .fromTo(o, { y: "5%" }, { y: "-5%", ease: "none" }, 0),
          gsap
            .timeline({
              scrollTrigger: {
                trigger: e,
                start: () => `top-=${t.offsetHeight}px bottom`,
                end: () => `top-=${t.offsetHeight}px top`,
                onEnter() {
                  e.classList.add("locked");
                },
                onLeaveBack() {
                  e.classList.remove("locked");
                },
              },
            })
            .fromTo(n, { opacity: 0 }, { opacity: 1, ease: "none" }, 0.25);
      },
      card: function () {
        let t = document.querySelector("header");
        gsap.utils
          .toArray("div.card:not(.always-locked):not(.card-lock-top)")
          .forEach((t) => {
            ScrollTrigger.create({
              trigger: t,
              start: "top bottom",
              end: "bottom bottom",
              onLeave() {
                t.classList.add("locked");
              },
              onEnterBack() {
                t.classList.remove("locked");
              },
            });
          }),
          gsap.utils.toArray("div.card.card-lock-top").forEach((e) => {
            ScrollTrigger.create({
              trigger: e,
              start: "top bottom",
              end: () => `top-=${t.offsetHeight}px top`,
              onLeave() {
                e.classList.add("locked");
              },
              onEnterBack() {
                e.classList.remove("locked");
              },
            });
          });
      },
    },
  },
  Tequilas = {
    _register: {},
    setup: {
      awards: function () {
        let t = document.getElementById("tequilas-awards"),
          e = t.querySelector("div.splide"),
          o = e.querySelectorAll("li.splide__slide");
        o.length > 2 &&
          (e.splide = new Splide(e, {
            type: "loop",
            drag: !0,
            focus: "left",
            arrows: !0,
            pagination: !1,
            autoWidth: !0,
            breakpoints: { 767: { destroy: !0 } },
          }).mount());
      },
    },
    events: function () {},
    unload: function () {},
    functions: {},
    interaction: {},
    resize: {
      testimonials: function () {
        let t = document.getElementById("tequilas-testimonials");
        if (!t) return;
        let e = t.querySelector("div.body");
        t.style.setProperty("--text-height", `${e.offsetHeight}px`);
      },
    },
    scroll: {
      testimonials: function () {
        let t = document.querySelector("header"),
          e = document.getElementById("tequilas-testimonials"),
          o = e.querySelector("div.body");
        ScrollTrigger.create({
          trigger: e,
          start: () => `top top+=${t.offsetHeight}px`,
          end: () => `bottom-=${o.offsetHeight}px top+=${t.offsetHeight}px`,
          onEnter() {
            e.classList.add("sticky");
          },
          onLeaveBack() {
            e.classList.remove("sticky");
          },
          onLeave() {
            e.classList.add("stuck");
          },
          onEnterBack() {
            e.classList.remove("stuck");
          },
        });
      },
    },
  },
  Tequila = {
    _register: {},
    setup: {
      analytics: function () {
        Analytics.view_product(product);
      },
      bar: function () {
        let t = document.getElementById("tequila-bar");
        setTimeout(() => {
          t.classList.add("reveal");
        }, 600);
      },
    },
    events: function () {
      $(document).on(
        "click.page",
        'button[action^="tequila.gallery"]',
        function () {
          Tequila.interaction.gallery.next(this);
        }
      ),
        $(document).on(
          "click.page",
          'button[action="tequila.quantity"]',
          function () {
            Cart.interaction.product.quantity(this);
          }
        );
    },
    unload: function () {},
    functions: {},
    interaction: {
      gallery: {
        next: function (t) {
          let e = t.closest("section").querySelector("div.gallery"),
            o = t.getAttribute("action").includes(".next");
          if (e.busy) return;
          (e.busy = !0),
            setTimeout(() => {
              e.busy = !1;
            }, 400),
            (e.zindex = ++e.zindex || 4),
            e.style.setProperty("--z-index", e.zindex);
          let i = e.querySelector("figure.active");
          i.classList.remove("active");
          let n;
          (n = o
            ? i.nextElementSibling || i.parentElement.firstElementChild
            : i.previousElementSibling ||
              i.parentElement.lastElementChild).classList.add("active");
        },
      },
    },
    resize: {
      bar: function () {
        let t = document.getElementById("tequila-container"),
          e = document.getElementById("tequila-bar");
        e && t.style.setProperty("--bar-height", `${e.offsetHeight}px`);
      },
    },
    scroll: {
      hero: function () {
        let t = document.querySelector("div.page section.tequila-hero");
        ScrollTrigger.create({
          trigger: t,
          start: "top top",
          end: "bottom bottom",
          onLeave() {
            t.classList.add("lock");
          },
          onEnterBack() {
            t.classList.remove("lock");
          },
        });
      },
      bar: function () {
        let t = document.querySelector("header"),
          e = document.getElementById("tequila-container"),
          o = document.getElementById("tequila-bar");
        ScrollTrigger.create({
          trigger: e,
          start: () => `top top+=${t.offsetHeight}px`,
          end: () =>
            window.matchMedia("(max-width: 767.9px)").matches
              ? "bottom bottom"
              : `bottom top+=${t.offsetHeight + o.offsetHeight}px`,
          onEnter() {
            o.classList.add("sticky");
          },
          onLeaveBack() {
            o.classList.remove("sticky");
          },
          onLeave() {
            o.classList.add("lock");
          },
          onEnterBack() {
            o.classList.remove("lock");
          },
        });
      },
    },
  },
  Merch = {
    _register: {},
    base: function () {},
    setup: {},
    events: function () {
      $(document).on(
        "click.page",
        'button[action="product.zoom"]',
        function () {
          Merch.interaction.zoom(this);
        }
      ),
        $(document).on(
          "click.page",
          'button[action^="product.gallery"]',
          function () {
            Merch.interaction.gallery.next(this);
          }
        ),
        $(document).on(
          "click.page",
          'section#merch li.product:not(.active) button[action="details.toggle"]',
          function () {
            Merch.interaction.view_product(this);
          }
        ),
        $(document).on(
          "mouseenter.page",
          "figure[data-product-gallery] div.image-container",
          function () {
            Merch.interaction.gallery.on(this.parentElement);
          }
        ),
        $(document).on(
          "mouseleave.page",
          "figure[data-product-gallery] div.image-container",
          function () {
            Merch.interaction.gallery.off(this.parentElement);
          }
        );
    },
    unload: function () {},
    functions: {},
    interaction: {
      gallery: {
        on: function (t) {
          this.off(t);
          let e = t.closest("li.product");
          e.matches(".active, .zoom") ||
            (this.image(t),
            (t.product_gallery = setInterval(() => this.image(t), 1200)));
        },
        off: function (t) {
          clearInterval(t.product_gallery);
        },
        next: function (t) {
          let e = t
            .closest("li.product")
            .querySelector("figure[data-product-gallery]");
          this.off(e);
          let o = t.getAttribute("action").includes(".next");
          this.image(e, o);
        },
        image: function (t, e = !0) {
          if (t.busy) return;
          (t.busy = !0),
            setTimeout(() => {
              t.busy = !1;
            }, 400),
            (t.zindex = ++t.zindex || 4),
            t.style.setProperty("--z-index", t.zindex);
          let o = t.querySelector("img.active");
          o.classList.remove("active");
          let i;
          (i = e
            ? o.nextElementSibling || o.parentElement.firstElementChild
            : o.previousElementSibling ||
              o.parentElement.lastElementChild).classList.add("active");
        },
      },
      view_product(t) {
        let e = t.closest("li.product"),
          o = products[e.getAttribute("product")];
        Analytics.view_product(o);
      },
      zoom: function (t) {
        let e = t.closest("li.product");
        e.classList.toggle("zoom"),
          e.classList.add("zooming"),
          clearTimeout(e.zoom_timer),
          (e.zoom_timer = setTimeout(() => {
            e.classList.remove("zooming");
          }, 400)),
          gsap.utils
            .toArray(e.parentElement.querySelectorAll("li.zoom"))
            .forEach((t) => {
              t !== e &&
                (t.classList.remove("zoom"),
                t.classList.add("zooming"),
                clearTimeout(t.zoom_timer),
                (t.zoom_timer = setTimeout(() => {
                  t.classList.remove("zooming");
                }, 400)));
            });
        let o = e.querySelector("figure[data-product-gallery]");
        if ((Merch.interaction.gallery.off(o), e.classList.contains("zoom"))) {
          let i;
          if (window.matchMedia("(max-width: 767px)").matches) {
            let n = e.parentElement.offsetTop,
              r = Math.ceil(
                [...e.parentElement.children]
                  .slice(0, [...e.parentElement.children].indexOf(e))
                  .reduce((t, e) => t + (e.base_height || 0), 0)
              );
            i = n + r;
          } else {
            let a = e.offsetHeight,
              s = getTop(e);
            i = s - (window.innerHeight - a) / 2;
          }
          lenis.scrollTo(i, { duration: 0.4, easing: (t) => --t * t * t + 1 });
        }
      },
    },
    resize: {
      product_title_bar: function () {
        gsap.utils
          .toArray('section#merch li.product button[action="details.toggle"]')
          .forEach((t) => {
            let e = t.closest("li.product");
            e.style.setProperty("--product-title-bar", `${t.offsetHeight}px`),
              (e.base_height = 1.03 * window.innerWidth + t.offsetHeight);
          });
      },
    },
    scroll: {},
  },
  Page = {
    _register: {},
    base: function () {},
    setup: {},
    events: function () {},
    unload: function () {},
    functions: {},
    interaction: {},
    scroll: {},
  },
  Cart = {
    setup: {
      active: function () {
        let t = new URLSearchParams(window.location.search);
        t.has("cart") &&
          setTimeout(() => {
            Cart.interaction.toggle(!0);
          }, 500);
      },
      get: function () {
        fetch("/wp-json/api/cart/get")
          .then((t) => {
            if (!t.ok) throw Error("Unable to retrieve cart");
            return t.json();
          })
          .then((t) => {
            Cart.functions.update(t);
          })
          .catch((t) => {
            console.error(t);
          });
      },
    },
    events: function () {
      $(document).on("click.page", 'button[action="cart.open"]', function () {
        Cart.interaction.toggle(!0);
      }),
        $(document).on(
          "click.page",
          'button[action="cart.close"]',
          function () {
            Cart.interaction.toggle(!1);
          }
        ),
        $(document).on("keydown.page", "body.cart", function (t) {
          "Escape" == t.key && Cart.interaction.toggle(!1);
        }),
        $(document).on("click.page", 'button[action="cart.add"]', function () {
          Cart.interaction.add(this);
        }),
        $(document).on(
          "click.page",
          'button[action="cart.item.quantity"]',
          function () {
            Cart.interaction.quantity(this);
          }
        ),
        $(document).on(
          "click.page",
          'button[action="cart.item.remove"]',
          function () {
            Cart.interaction.remove($(this));
          }
        ),
        $(document).on("click.page", "a[cart-checkout]", function (t) {
          t.preventDefault(), Cart.interaction.checkout(this);
        }),
        $(document).on(
          "click.page",
          'button[action="product.variant"]',
          function () {
            Cart.interaction.product.variant(this);
          }
        ),
        $(document).on(
          "click.page",
          'button[action="product.quantity"]',
          function () {
            Cart.interaction.product.quantity(this);
          }
        );
    },
    functions: {
      update: function (t) {
        (Cart._register.cart_data = t),
          this.quantity(t.quantity),
          this.items(t.lines),
          this.totals(t),
          this.checkout_url(t);
      },
      quantity: function (t) {
        $("section#cart").toggleClass("empty", !t),
          $("[cart-items]").text(t),
          $("[cart-items-attr]").attr("cart-items-attr", t);
      },
      items: function (t) {
        let e = wNumb({ mark: ".", thousand: ",", decimals: 2, prefix: "$" }),
          o = document.getElementById("cart"),
          i = o.querySelector("ul#cart-items"),
          n = {},
          r = i.querySelector("li.template");
        i.querySelectorAll("li:not(.template)").forEach((t) => {
          n[t.id] = !0;
        }),
          t.forEach((t) => {
            let o = document.getElementById(t.id),
              a = o || r.cloneNode(!0);
            o
              ? delete n[t.id]
              : (a.classList.remove("template"),
                i.appendChild(a),
                (a.id = t.id)),
              (a.product_id = t.product_id),
              (a.quantity = t.quantity),
              a.setAttribute("quantity", t.quantity),
              (a.item_price = t.item_price),
              a
                .querySelector('[item="image"]')
                .setAttribute("src", t.thumbnail),
              (a.querySelector('[item="product"]').textContent = t.product),
              t.variant
                ? (a.querySelector('[item="variant"]').textContent = t.variant)
                : a.querySelector('[item="variant"]').remove(),
              (a.querySelector('[item="price"]').textContent = e.to(
                parseFloat(t.line_price)
              )),
              (a.querySelector("div[data-quantity]").dataset.quantity =
                t.quantity),
              a
                .querySelector(
                  'div[data-quantity] button[action="cart.item.quantity"]:first-of-type'
                )
                .classList.toggle("disabled", 1 == t.quantity),
              a
                .querySelector(
                  'div[data-quantity] button[action="cart.item.quantity"]:last-of-type'
                )
                .classList.toggle("disabled", t.quantity == t.available),
              (a.querySelector("div[data-quantity]").dataset.available =
                t.available),
              (a.querySelector('[item="quantity"]').textContent = t.quantity);
          }),
          Object.keys(n).forEach((t) => {
            let e = document.getElementById(t);
            Cart.interaction.remove_from_cart($(e));
          });
      },
      totals: function (t) {
        let e = wNumb({ mark: ".", thousand: ",", decimals: 2, prefix: "$" }),
          o = document.getElementById("cart"),
          i = o.querySelector('[cart="subtotal"]');
        i.textContent = e.to(parseFloat(t.subtotal));
      },
      checkout_url: function (t) {
        let e = document.querySelector("section#cart a[cart-checkout]");
        if (!Cart._register.cart_data) return;
        let o = Cart._register.cart_data.checkout_url
            .split("/cart/c/")[1]
            .split("?")[0],
          i = new URLSearchParams(
            Cart._register.cart_data.checkout_url.split("?")[1]
          ).get("key"),
          n = e.getAttribute("checkout"),
          r = Cart._register.cart_data.lines
            .map((t) => `${t.variant_id}:${t.quantity}`)
            .join(",");
        n += r;
        let a = [];
        a.push("storefront=true&redirect-to-checkout=true"),
          a.push(`checkout-slug=${o}&checkout-key=${i}`),
          window._learnq &&
            _learnq.push(["_getIdentifiers"]).$exchange_id &&
            a.push(`_kx=${_learnq.push(["_getIdentifiers"]).$exchange_id}`),
          a.length && (n += (n.includes("?") ? "&" : "?") + a.join("&")),
          e.setAttribute("href", n);
      },
    },
    interaction: {
      toggle: function (t) {
        let e = document.getElementById("cart");
        clearTimeout(e.animating),
          e.classList.add("animate"),
          (e.animating = setTimeout(() => {
            e.classList.remove("animate");
          }, 500)),
          $("body").toggleClass("cart", t),
          t &&
            ((e.querySelector("div.container").scrollTop = 0),
            e.querySelectorAll("li.remove").forEach((t) => t.remove())),
          lenis[t ? "stop" : "start"]();
      },
      checkout: function (t) {
        Website.transition._init(),
          setTimeout(() => {
            window.location.href = t.getAttribute("href");
          }, 800);
      },
      product: {
        quantity: function (t) {
          let e = t.closest("form"),
            o = t.closest("div.quantity"),
            i = o.querySelector("label"),
            n = e.querySelector('button[action="cart.add"]'),
            r = parseInt(o.dataset.quantity) + parseInt(t.dataset.quantity);
          o.dataset.quantity = i.textContent = n.dataset.quantity = r;
        },
        variant: function (t) {
          t.classList.add("active"),
            $(t).siblings(".active").removeClass("active");
          let e = t.closest("form"),
            o = e.querySelector('button[action="cart.add"]');
          o.dataset.variant_id = t.dataset.variant_id;
          let i = t.closest("li.product"),
            n = products[i.getAttribute("product")];
          (n.VariantID = t.dataset.variant_id),
            (n.VariantName = t.textContent),
            Analytics.view_product(n);
        },
      },
      add: function (t) {
        fetch("/wp-json/api/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: t.dataset.local_product_id,
            variant_id: t.dataset.variant_id,
            quantity: t.dataset.quantity,
          }),
        })
          .then((t) => {
            if (!t.ok) throw Error("Unable to add to cart");
            return t.json();
          })
          .then((e) => {
            if (
              (Cart.functions.update(e),
              $("section#cart").hasClass("active") || this.toggle(!0),
              $("section#merch").length)
            ) {
              let o = t.closest(".product"),
                i = products[o.getAttribute("product")];
              Analytics.add_to_cart(i, t.dataset.quantity);
            } else Analytics.add_to_cart(product, t.dataset.quantity);
          })
          .catch((t) => {
            console.error(t);
          });
      },
      quantity: function (t) {
        let e = t.closest("li"),
          o = e.querySelector("div.quantity"),
          i = o.querySelector("label");
        e.querySelector('[item="price"]');
        let n = Math.max(e.quantity + parseInt(t.dataset.quantity));
        e.updating ||
          ((e.dataset.quantity = n),
          (e.updating = !0),
          (i.textContent = n),
          e
            .querySelector(
              'div[data-quantity] button[action="cart.item.quantity"]:first-of-type'
            )
            .classList.toggle("disabled", 1 == n),
          e
            .querySelector(
              'div[data-quantity] button[action="cart.item.quantity"]:last-of-type'
            )
            .classList.toggle("disabled", n == parseInt(o.dataset.available)),
          fetch("/wp-json/api/cart/quantity", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ line_id: e.id, quantity: n }),
          })
            .then((t) => {
              if ((console.log(t), (e.updating = !1), !t.ok))
                throw Error("Unable to update quantity");
              return t.json();
            })
            .then((t) => {
              Cart.functions.update(t);
            })
            .catch((t) => {
              (i.textContent = e.quantity), console.error(t);
            }));
      },
      remove: function (t) {
        let e = t.parents("li");
        (line = e.get(0)).updating ||
          ((line.updating = !0),
          this.remove_from_cart(e),
          fetch("/wp-json/api/cart/remove", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ line_id: line.id }),
          })
            .then((t) => {
              if (!t.ok) throw Error("Unable to remove item");
              return t.json();
            })
            .then((t) => {
              Cart.functions.update(t);
            })
            .catch((t) => {
              console.error(t);
            }));
      },
      remove_from_cart(t) {
        t.css("height", getHeight(t))
          .prop(
            "remove",
            setTimeout(() => {
              t.addClass("remove").removeAttr("style"),
                $("section#cart ul#cart-items li:not(.template):not(.remove)")
                  .length || $("section#cart").addClass("empty");
            }, 10)
          )
          .prop(
            "removed",
            setTimeout(() => {
              t.remove();
            }, 520)
          );
      },
    },
  },
  Form = {
    setup: {
      autofill: function () {
        gsap.utils.toArray("form").forEach((t) => {
          t.background = gsap.getProperty(t, "--form-background");
        });
      },
    },
    events: function () {
      $(document).on("mousemove.page", 'form[controller="form"]', function (t) {
        $(document).off("mousemove", $(this)),
          $(this).attr("action", $(this).attr("handler"));
      }),
        $(document).on(
          "submit.page",
          'form[controller="form"][handler]',
          function (t) {
            t.preventDefault(), Form.interaction.post({ $form: $(this) });
          }
        ),
        $(document).on(
          "submit.page",
          'form[controller="form"]:not([handler])',
          function (t) {
            t.preventDefault();
          }
        ),
        $(document).on(
          "blur.page, input.page",
          'form input[type="text"], form input[type="email"], form input[type="password"]',
          function () {
            Form.interaction.autofill(this);
          }
        ),
        $(document).on(
          "focus.page",
          'form[controller="form"] input, form[controller="form"] select, form[controller="form"] textarea',
          function () {
            Form.interaction.controls.focus($(this), !0);
          }
        ),
        $(document).on(
          "blur.page",
          'form[controller="form"] input, form[controller="form"] select, form[controller="form"] textarea',
          function () {
            Form.interaction.controls.focus($(this), !1);
          }
        ),
        $(document).on(
          "input.page",
          'form[controller="form"] input, form[controller="form"] select, form[controller="form"] textarea',
          function () {
            Form.interaction.controls.label($(this));
          }
        ),
        $(document).on(
          "input.page",
          'form[controller="form"] textarea[auto-expand]',
          function () {
            Form.interaction.controls.textarea($(this));
          }
        );
    },
    interaction: {
      autofill: function (t) {
        let e = $(t).parents("form").get(0).background,
          o = getHex(t, "backgroundColor"),
          i = t.value;
        e != o && ((t.value = i + " "), (t.value = i));
      },
      controls: {
        focus: function (t, e) {
          t.parents("fieldset").toggleClass("focus", !!e);
        },
        label: function (t) {
          t.parents("form").removeClass("complete"),
            t.parents("fieldset").toggleClass("active", !!t.val());
        },
        textarea: function (t) {
          setTimeout(() => {
            t.css("height", "auto"),
              t.css("height", t.prop("scrollHeight") + 0 + "px");
          }, 0);
        },
      },
      post: function (t) {
        let { $form: e, action: o = e.attr("action"), formData: i = null } = t;
        e.hasClass("busy") ||
          (e.addClass("busy"),
          i ||
            ((i = new FormData()),
            e
              .find('input:not([type="file"]), select, textarea')
              .each(function () {
                $(this).is(":checkbox")
                  ? $(this).is(":checked") &&
                    i.append($(this).attr("name") + "[]", $(this).val())
                  : $(this).is(":radio")
                  ? $(this).is(":checked") &&
                    i.append($(this).attr("name"), $(this).val())
                  : i.append($(this).attr("name"), $(this).val());
              })),
          $.ajax({
            url: o,
            type: "POST",
            data: i,
            contentType: !1,
            processData: !1,
            success: function (t) {
              Form.interaction.success(e, t);
            },
            error: function (t, e, o) {
              console.log("Error: " + e + " - " + o);
            },
          }));
      },
      success: function (t, e) {
        if (
          (t.removeClass("busy"),
          ($response = $.parseJSON(e)),
          this.clear_errors(t),
          "ok" == $response.status)
        )
          switch ($response.data.action) {
            case "form.complete":
              this.complete(t, $response.data.form_data);
              break;
            case "form.redirect":
              Website.transition._init({
                destination: $response.data.destination,
              }),
                Website._smoothState.load($response.data.destination);
              break;
            case "form.reload":
              window.location = $response.data.destination;
          }
        else Form.interaction.errors(t, $response.data);
      },
      errors: function (t, e) {
        $.each(e, function (e, o) {
          if (
            ((o = o.toString().split(":"))[0].indexOf("{") > -1
              ? ((o[0] = o[0].split("{")),
                (o[0][1] = o[0][1].substring(0, o[0][1].length - 1)))
              : (o[0] = [o[0], "0"]),
            t.find('[name="' + o[0][0] + '"]').length)
          ) {
            if (
              (t
                .find('[name="' + o[0][0] + '"]')
                .attr("placeholder", o[1])
                .val("")
                .parents("fieldset")
                .addClass("error")
                .removeClass("active"),
              !e)
            ) {
              let i = t.find('[name="' + o[0][0] + '"]').parents("fieldset"),
                n = i.get(0).getBoundingClientRect();
              (n.top >= 0 && n.bottom <= window.innerHeight) ||
                window.scrollTo(
                  0,
                  i.offset().top - $("section#header").height()
                );
            }
          } else "alert" == o[0][0] && alert(o[1]);
        });
      },
      clear_errors(t) {
        t.find("fieldset.error").removeClass("error");
      },
      complete: function (t, e) {},
    },
  };

!(function (t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define(e)
    : ((t =
        "undefined" != typeof globalThis ? globalThis : t || self).SplitType =
        e());
})(this, function () {
  "use strict";
  function t(t, e) {
    for (var n = 0; n < e.length; n++) {
      var r = e[n];
      (r.enumerable = r.enumerable || !1),
        (r.configurable = !0),
        "value" in r && (r.writable = !0),
        Object.defineProperty(t, r.key, r);
    }
  }
  function e(e, n, r) {
    return n && t(e.prototype, n), r && t(e, r), e;
  }
  function n(t, e, n) {
    return (
      e in t
        ? Object.defineProperty(t, e, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (t[e] = n),
      t
    );
  }
  function r(t, e) {
    var n = Object.keys(t);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(t);
      e &&
        (r = r.filter(function (e) {
          return Object.getOwnPropertyDescriptor(t, e).enumerable;
        })),
        n.push.apply(n, r);
    }
    return n;
  }
  function o(t) {
    for (var e = 1; e < arguments.length; e++) {
      var o = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? r(Object(o), !0).forEach(function (e) {
            n(t, e, o[e]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(o))
        : r(Object(o)).forEach(function (e) {
            Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(o, e));
          });
    }
    return t;
  }
  function i(t, e) {
    return (
      (function (t) {
        if (Array.isArray(t)) return t;
      })(t) ||
      (function (t, e) {
        if ("undefined" == typeof Symbol || !(Symbol.iterator in Object(t)))
          return;
        var n = [],
          r = !0,
          o = !1,
          i = void 0;
        try {
          for (
            var a, c = t[Symbol.iterator]();
            !(r = (a = c.next()).done) &&
            (n.push(a.value), !e || n.length !== e);
            r = !0
          );
        } catch (t) {
          (o = !0), (i = t);
        } finally {
          try {
            r || null == c.return || c.return();
          } finally {
            if (o) throw i;
          }
        }
        return n;
      })(t, e) ||
      c(t, e) ||
      (function () {
        throw new TypeError(
          "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
        );
      })()
    );
  }
  function a(t) {
    return (
      (function (t) {
        if (Array.isArray(t)) return s(t);
      })(t) ||
      (function (t) {
        if ("undefined" != typeof Symbol && Symbol.iterator in Object(t))
          return Array.from(t);
      })(t) ||
      c(t) ||
      (function () {
        throw new TypeError(
          "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
        );
      })()
    );
  }
  function c(t, e) {
    if (t) {
      if ("string" == typeof t) return s(t, e);
      var n = Object.prototype.toString.call(t).slice(8, -1);
      return (
        "Object" === n && t.constructor && (n = t.constructor.name),
        "Map" === n || "Set" === n
          ? Array.from(t)
          : "Arguments" === n ||
            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
          ? s(t, e)
          : void 0
      );
    }
  }
  function s(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
    return r;
  }
  function l(t, e) {
    return Object.getOwnPropertyNames(Object(t)).reduce(function (n, r) {
      var o = Object.getOwnPropertyDescriptor(Object(t), r),
        i = Object.getOwnPropertyDescriptor(Object(e), r);
      return Object.defineProperty(n, r, i || o);
    }, {});
  }
  function u(t) {
    return "string" == typeof t;
  }
  function f(t) {
    return Array.isArray(t);
  }
  function p() {
    var t,
      e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
      n = l(e);
    return (
      void 0 !== n.types ? (t = n.types) : void 0 !== n.split && (t = n.split),
      void 0 !== t &&
        (n.types = (u(t) || f(t) ? String(t) : "")
          .split(",")
          .map(function (t) {
            return String(t).trim();
          })
          .filter(function (t) {
            return /((line)|(word)|(char))/i.test(t);
          })),
      (n.absolute || n.position) &&
        (n.absolute = n.absolute || /absolute/.test(e.position)),
      n
    );
  }
  function d(t) {
    var e = u(t) || f(t) ? String(t) : "";
    return {
      none: !e,
      lines: /line/i.test(e),
      words: /word/i.test(e),
      chars: /char/i.test(e),
    };
  }
  function h(t) {
    return null !== t && "object" == typeof t;
  }
  function y(t) {
    return h(t) && /^(1|3|11)$/.test(t.nodeType);
  }
  function g(t) {
    return f(t)
      ? t
      : null == t
      ? []
      : (function (t) {
          return (
            h(t) &&
            (function (t) {
              return "number" == typeof t && t > -1 && t % 1 == 0;
            })(t.length)
          );
        })(t)
      ? Array.prototype.slice.call(t)
      : [t];
  }
  function v(t) {
    var e = t;
    return (
      u(t) &&
        (e = /^(#[a-z]\w+)$/.test(t.trim())
          ? document.getElementById(t.trim().slice(1))
          : document.querySelectorAll(t)),
      g(e).reduce(function (t, e) {
        return [].concat(a(t), a(g(e).filter(y)));
      }, [])
    );
  }
  !(function () {
    function t() {
      for (var t = arguments.length, e = 0; e < t; e++) {
        var n = e < 0 || arguments.length <= e ? void 0 : arguments[e];
        1 === n.nodeType || 11 === n.nodeType
          ? this.appendChild(n)
          : this.appendChild(document.createTextNode(String(n)));
      }
    }
    function e() {
      for (; this.lastChild; ) this.removeChild(this.lastChild);
      arguments.length && this.append.apply(this, arguments);
    }
    function n() {
      for (
        var t = this.parentNode, e = arguments.length, n = new Array(e), r = 0;
        r < e;
        r++
      )
        n[r] = arguments[r];
      var o = n.length;
      if (t)
        for (o || t.removeChild(this); o--; ) {
          var i = n[o];
          "object" != typeof i
            ? (i = this.ownerDocument.createTextNode(i))
            : i.parentNode && i.parentNode.removeChild(i),
            o
              ? t.insertBefore(this.previousSibling, i)
              : t.replaceChild(i, this);
        }
    }
    "undefined" != typeof Element &&
      (Element.prototype.append ||
        ((Element.prototype.append = t),
        (DocumentFragment.prototype.append = t)),
      Element.prototype.replaceChildren ||
        ((Element.prototype.replaceChildren = e),
        (DocumentFragment.prototype.replaceChildren = e)),
      Element.prototype.replaceWith ||
        ((Element.prototype.replaceWith = n),
        (DocumentFragment.prototype.replaceWith = n)));
  })();
  var m = Object.entries,
    b = "_splittype",
    w = {},
    O = 0;
  function j(t, e, n) {
    if (!h(t)) return console.warn("[data.set] owner is not an object"), null;
    var r = t[b] || (t[b] = ++O),
      i = w[r] || (w[r] = {});
    return (
      void 0 === n
        ? e &&
          Object.getPrototypeOf(e) === Object.prototype &&
          (w[r] = o(o({}, i), e))
        : void 0 !== e && (i[e] = n),
      n
    );
  }
  function C(t, e) {
    var n = h(t) ? t[b] : null,
      r = (n && w[n]) || {};
    return void 0 === e ? r : r[e];
  }
  function E(t) {
    var e = t && t[b];
    e && (delete t[e], delete w[e]);
  }
  var S = "\\ud800-\\udfff",
    x = "\\u0300-\\u036f\\ufe20-\\ufe23",
    T = "\\u20d0-\\u20f0",
    W = "\\ufe0e\\ufe0f",
    k = "[".concat(S, "]"),
    A = "[".concat(x).concat(T, "]"),
    P = "\\ud83c[\\udffb-\\udfff]",
    D = "(?:".concat(A, "|").concat(P, ")"),
    N = "[^".concat(S, "]"),
    R = "(?:\\ud83c[\\udde6-\\uddff]){2}",
    $ = "[\\ud800-\\udbff][\\udc00-\\udfff]",
    B = "\\u200d",
    F = "".concat(D, "?"),
    I = "[".concat(W, "]?"),
    L = I + F + ("(?:\\u200d(?:" + [N, R, $].join("|") + ")" + I + F + ")*"),
    H = "(?:".concat(
      ["".concat(N).concat(A, "?"), A, R, $, k].join("|"),
      "\n)"
    ),
    M = RegExp("".concat(P, "(?=").concat(P, ")|").concat(H).concat(L), "g"),
    z = RegExp("[".concat([B, S, x, T, W].join(""), "]"));
  function V(t) {
    return z.test(t);
  }
  function q(t) {
    return V(t)
      ? (function (t) {
          return t.match(M) || [];
        })(t)
      : (function (t) {
          return t.split("");
        })(t);
  }
  function U(t) {
    return null == t ? "" : String(t);
  }
  function X(t, e) {
    var n = document.createElement(t);
    return e
      ? (Object.keys(e).forEach(function (t) {
          var r = e[t],
            o = u(r) ? r.trim() : r;
          null !== o &&
            "" !== o &&
            ("children" === t
              ? n.append.apply(n, a(g(o)))
              : n.setAttribute(t, o));
        }),
        n)
      : n;
  }
  var Y = {
    splitClass: "",
    lineClass: "line",
    wordClass: "word",
    charClass: "char",
    types: ["lines", "words", "chars"],
    absolute: !1,
    tagName: "div",
  };
  function _(t, e) {
    var n,
      r = d((e = l(Y, e)).types),
      o = e.tagName,
      i = t.nodeValue,
      c = document.createDocumentFragment(),
      s = [];
    return (
      /^\s/.test(i) && c.append(" "),
      (n = (function (t) {
        var e =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : " ";
        return (t ? String(t) : "").trim().replace(/\s+/g, " ").split(e);
      })(i).reduce(function (t, n, i, l) {
        var f, p;
        return (
          r.chars &&
            (p = (function (t) {
              var e =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : "";
              return (t = U(t)) && u(t) && !e && V(t) ? q(t) : t.split(e);
            })(n).map(function (t) {
              var n = X(o, {
                class: "".concat(e.splitClass, " ").concat(e.charClass),
                style: "display: inline-block;",
                children: t,
              });
              return j(n, "isChar", !0), (s = [].concat(a(s), [n])), n;
            })),
          r.words || r.lines
            ? (j(
                (f = X(o, {
                  class: "".concat(e.wordClass, " ").concat(e.splitClass),
                  style: "display: inline-block; ".concat(
                    r.words && e.absolute ? "position: relative;" : ""
                  ),
                  children: r.chars ? p : n,
                })),
                { isWord: !0, isWordStart: !0, isWordEnd: !0 }
              ),
              c.appendChild(f))
            : p.forEach(function (t) {
                c.appendChild(t);
              }),
          i < l.length - 1 && c.append(" "),
          r.words ? t.concat(f) : t
        );
      }, [])),
      /\s$/.test(i) && c.append(" "),
      t.replaceWith(c),
      { words: n, chars: s }
    );
  }
  function G(t, e) {
    var n = t.nodeType,
      r = { words: [], chars: [] };
    if (!/(1|3|11)/.test(n)) return r;
    if (3 === n && /\S/.test(t.nodeValue)) return _(t, e);
    var o = g(t.childNodes);
    if (o.length && (j(t, "isSplit", !0), !C(t).isRoot)) {
      (t.style.display = "inline-block"), (t.style.position = "relative");
      var i = t.nextSibling,
        c = t.previousSibling,
        s = t.textContent || "",
        l = i ? i.textContent : " ",
        u = c ? c.textContent : " ";
      j(t, {
        isWordEnd: /\s$/.test(s) || /^\s/.test(l),
        isWordStart: /^\s/.test(s) || /\s$/.test(u),
      });
    }
    return o.reduce(function (t, n) {
      var r = G(n, e),
        o = r.words,
        i = r.chars;
      return {
        words: [].concat(a(t.words), a(o)),
        chars: [].concat(a(t.chars), a(i)),
      };
    }, r);
  }
  function J(t) {
    C(t).isWord
      ? (E(t), t.replaceWith.apply(t, a(t.childNodes)))
      : g(t.children).forEach(function (t) {
          return J(t);
        });
  }
  function K(t, e, n) {
    var r,
      o,
      a,
      c = d(e.types),
      s = e.tagName,
      l = t.getElementsByTagName("*"),
      u = [],
      f = [],
      p = null,
      h = [],
      y = t.parentElement,
      v = t.nextElementSibling,
      m = document.createDocumentFragment(),
      b = window.getComputedStyle(t),
      w = b.textAlign,
      O = 0.2 * parseFloat(b.fontSize);
    return (
      e.absolute &&
        ((a = { left: t.offsetLeft, top: t.offsetTop, width: t.offsetWidth }),
        (o = t.offsetWidth),
        (r = t.offsetHeight),
        j(t, { cssWidth: t.style.width, cssHeight: t.style.height })),
      g(l).forEach(function (r) {
        var o = r.parentElement === t,
          a = (function (t, e, n, r) {
            if (!n.absolute) return { top: e ? t.offsetTop : null };
            var o = t.offsetParent,
              a = i(r, 2),
              c = a[0],
              s = a[1],
              l = 0,
              u = 0;
            if (o && o !== document.body) {
              var f = o.getBoundingClientRect();
              (l = f.x + c), (u = f.y + s);
            }
            var p = t.getBoundingClientRect(),
              d = p.width,
              h = p.height,
              y = p.x;
            return { width: d, height: h, top: p.y + s - u, left: y + c - l };
          })(r, o, e, n),
          s = a.width,
          l = a.height,
          d = a.top,
          h = a.left;
        /^br$/i.test(r.nodeName) ||
          (c.lines &&
            o &&
            ((null === p || d - p >= O) && ((p = d), u.push((f = []))),
            f.push(r)),
          e.absolute && j(r, { top: d, left: h, width: s, height: l }));
      }),
      y && y.removeChild(t),
      c.lines &&
        ((h = u.map(function (t) {
          var n = X(s, {
            class: "".concat(e.splitClass, " ").concat(e.lineClass),
            style: "display: block; text-align: ".concat(w, "; width: 100%;"),
          });
          j(n, "isLine", !0);
          var r = { height: 0, top: 1e4 };
          return (
            m.appendChild(n),
            t.forEach(function (t, e, o) {
              var i = C(t),
                a = i.isWordEnd,
                c = i.top,
                s = i.height,
                l = o[e + 1];
              (r.height = Math.max(r.height, s)),
                (r.top = Math.min(r.top, c)),
                n.appendChild(t),
                a && C(l).isWordStart && n.append(" ");
            }),
            e.absolute && j(n, { height: r.height, top: r.top }),
            n
          );
        })),
        c.words || J(m),
        t.replaceChildren(m)),
      e.absolute &&
        ((t.style.width = "".concat(t.style.width || o, "px")),
        (t.style.height = "".concat(r, "px")),
        g(l).forEach(function (t) {
          var e = C(t),
            n = e.isLine,
            r = e.top,
            o = e.left,
            i = e.width,
            c = e.height,
            s = C(t.parentElement),
            l = !n && s.isLine;
          (t.style.top = "".concat(l ? r - s.top : r, "px")),
            (t.style.left = "".concat(n ? a.left : o - (l ? a.left : 0), "px")),
            (t.style.height = "".concat(c, "px")),
            (t.style.width = "".concat(n ? a.width : i, "px")),
            (t.style.position = "absolute");
        })),
      y && (v ? y.insertBefore(t, v) : y.appendChild(t)),
      h
    );
  }
  var Q = l(Y, {});
  return (function () {
    function t(e, n) {
      !(function (t, e) {
        if (!(t instanceof e))
          throw new TypeError("Cannot call a class as a function");
      })(this, t),
        (this.isSplit = !1),
        (this.settings = l(Q, p(n))),
        (this.elements = v(e)),
        this.split();
    }
    return (
      e(t, null, [
        {
          key: "clearData",
          value: function () {
            Object.keys(w).forEach(function (t) {
              delete w[t];
            });
          },
        },
        {
          key: "setDefaults",
          value: function (t) {
            return (Q = l(Q, p(t))), Y;
          },
        },
        {
          key: "revert",
          value: function (t) {
            v(t).forEach(function (t) {
              var e = C(t),
                n = e.isSplit,
                r = e.html,
                o = e.cssWidth,
                i = e.cssHeight;
              n &&
                ((t.innerHTML = r),
                (t.style.width = o || ""),
                (t.style.height = i || ""),
                E(t));
            });
          },
        },
        {
          key: "create",
          value: function (e, n) {
            return new t(e, n);
          },
        },
        {
          key: "data",
          get: function () {
            return w;
          },
        },
        {
          key: "defaults",
          get: function () {
            return Q;
          },
          set: function (t) {
            Q = l(Q, p(t));
          },
        },
      ]),
      e(t, [
        {
          key: "split",
          value: function (t) {
            var e = this;
            this.revert(),
              this.elements.forEach(function (t) {
                j(t, "html", t.innerHTML);
              }),
              (this.lines = []),
              (this.words = []),
              (this.chars = []);
            var n = [window.pageXOffset, window.pageYOffset];
            void 0 !== t && (this.settings = l(this.settings, p(t)));
            var r = d(this.settings.types);
            r.none ||
              (this.elements.forEach(function (t) {
                j(t, "isRoot", !0);
                var n = G(t, e.settings),
                  r = n.words,
                  o = n.chars;
                (e.words = [].concat(a(e.words), a(r))),
                  (e.chars = [].concat(a(e.chars), a(o)));
              }),
              this.elements.forEach(function (t) {
                if (r.lines || e.settings.absolute) {
                  var o = K(t, e.settings, n);
                  e.lines = [].concat(a(e.lines), a(o));
                }
              }),
              (this.isSplit = !0),
              window.scrollTo(n[0], n[1]),
              m(w).forEach(function (t) {
                var e = i(t, 2),
                  n = e[0],
                  r = e[1],
                  o = r.isRoot,
                  a = r.isSplit;
                (o && a) || ((w[n] = null), delete w[n]);
              }));
          },
        },
        {
          key: "revert",
          value: function () {
            this.isSplit &&
              ((this.lines = null),
              (this.words = null),
              (this.chars = null),
              (this.isSplit = !1)),
              t.revert(this.elements);
          },
        },
      ]),
      t
    );
  })();
});
!(function (e) {
  "function" == typeof define && define.amd
    ? define([], e)
    : "object" == typeof exports
    ? (module.exports = e())
    : (window.wNumb = e());
})(function () {
  "use strict";
  var o = [
    "decimals",
    "thousand",
    "mark",
    "prefix",
    "suffix",
    "encoder",
    "decoder",
    "negativeBefore",
    "negative",
    "edit",
    "undo",
  ];
  function w(e) {
    return e.split("").reverse().join("");
  }
  function h(e, t) {
    return e.substring(0, t.length) === t;
  }
  function f(e, t, n) {
    if ((e[t] || e[n]) && e[t] === e[n]) throw new Error(t);
  }
  function x(e) {
    return "number" == typeof e && isFinite(e);
  }
  function n(e, t, n, r, i, o, f, u, s, c, a, p) {
    var d,
      l,
      h,
      g = p,
      v = "",
      m = "";
    return (
      o && (p = o(p)),
      !!x(p) &&
        (!1 !== e && 0 === parseFloat(p.toFixed(e)) && (p = 0),
        p < 0 && ((d = !0), (p = Math.abs(p))),
        !1 !== e &&
          (p = (function (e, t) {
            return (
              (e = e.toString().split("e")),
              (+(
                (e = (e = Math.round(+(e[0] + "e" + (e[1] ? +e[1] + t : t))))
                  .toString()
                  .split("e"))[0] +
                "e" +
                (e[1] ? e[1] - t : -t)
              )).toFixed(t)
            );
          })(p, e)),
        -1 !== (p = p.toString()).indexOf(".")
          ? ((h = (l = p.split("."))[0]), n && (v = n + l[1]))
          : (h = p),
        t && (h = w((h = w(h).match(/.{1,3}/g)).join(w(t)))),
        d && u && (m += u),
        r && (m += r),
        d && s && (m += s),
        (m += h),
        (m += v),
        i && (m += i),
        c && (m = c(m, g)),
        m)
    );
  }
  function r(e, t, n, r, i, o, f, u, s, c, a, p) {
    var d,
      l = "";
    return (
      a && (p = a(p)),
      !(!p || "string" != typeof p) &&
        (u && h(p, u) && ((p = p.replace(u, "")), (d = !0)),
        r && h(p, r) && (p = p.replace(r, "")),
        s && h(p, s) && ((p = p.replace(s, "")), (d = !0)),
        i &&
          (function (e, t) {
            return e.slice(-1 * t.length) === t;
          })(p, i) &&
          (p = p.slice(0, -1 * i.length)),
        t && (p = p.split(t).join("")),
        n && (p = p.replace(n, ".")),
        d && (l += "-"),
        "" !== (l = (l += p).replace(/[^0-9\.\-.]/g, "")) &&
          ((l = Number(l)), f && (l = f(l)), !!x(l) && l))
    );
  }
  function i(e, t, n) {
    var r,
      i = [];
    for (r = 0; r < o.length; r += 1) i.push(e[o[r]]);
    return i.push(n), t.apply("", i);
  }
  return function e(t) {
    if (!(this instanceof e)) return new e(t);
    "object" == typeof t &&
      ((t = (function (e) {
        var t,
          n,
          r,
          i = {};
        for (
          void 0 === e.suffix && (e.suffix = e.postfix), t = 0;
          t < o.length;
          t += 1
        )
          if (void 0 === (r = e[(n = o[t])]))
            "negative" !== n || i.negativeBefore
              ? "mark" === n && "." !== i.thousand
                ? (i[n] = ".")
                : (i[n] = !1)
              : (i[n] = "-");
          else if ("decimals" === n) {
            if (!(0 <= r && r < 8)) throw new Error(n);
            i[n] = r;
          } else if (
            "encoder" === n ||
            "decoder" === n ||
            "edit" === n ||
            "undo" === n
          ) {
            if ("function" != typeof r) throw new Error(n);
            i[n] = r;
          } else {
            if ("string" != typeof r) throw new Error(n);
            i[n] = r;
          }
        return (
          f(i, "mark", "thousand"),
          f(i, "prefix", "negative"),
          f(i, "prefix", "negativeBefore"),
          i
        );
      })(t)),
      (this.to = function (e) {
        return i(t, n, e);
      }),
      (this.from = function (e) {
        return i(t, r, e);
      }));
  };
});
!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? t(exports)
    : "function" == typeof define && define.amd
    ? define(["exports"], t)
    : t(((e = e || self).window = e.window || {}));
})(this, function (e) {
  "use strict";
  function h() {
    return "undefined" != typeof window;
  }
  function i() {
    return t || (h() && (t = window.gsap) && t.registerPlugin && t);
  }
  function j() {
    return (
      n ||
        (s(),
        o ||
          console.warn("Please gsap.registerPlugin(CSSPlugin, CSSRulePlugin)")),
      n
    );
  }
  var t,
    n,
    c,
    o,
    s = function _initCore(e) {
      (t = e || i()),
        h() && (c = document),
        t && (o = t.plugins.css) && (n = 1);
    },
    r = {
      version: "3.11.0",
      name: "cssRule",
      init: function init(e, t, n, i, s) {
        if (!j() || void 0 === e.cssText) return !1;
        var r = (e._gsProxy = e._gsProxy || c.createElement("div"));
        (this.ss = e),
          (this.style = r.style),
          (r.style.cssText = e.cssText),
          o.prototype.init.call(this, r, t, n, i, s);
      },
      render: function render(e, t) {
        for (var n, i = t._pt, s = t.style, r = t.ss; i; )
          i.r(e, i.d), (i = i._next);
        for (n = s.length; -1 < --n; ) r[s[n]] = s[s[n]];
      },
      getRule: function getRule(e) {
        j();
        var t,
          n,
          i,
          s,
          r = c.all ? "rules" : "cssRules",
          o = c.styleSheets,
          l = o.length,
          u = ":" === e.charAt(0);
        for (
          e = (u ? "" : ",") + e.split("::").join(":").toLowerCase() + ",",
            u && (s = []);
          l--;

        ) {
          try {
            if (!(n = o[l][r])) continue;
            t = n.length;
          } catch (e) {
            console.warn(e);
            continue;
          }
          for (; -1 < --t; )
            if (
              (i = n[t]).selectorText &&
              -1 !==
                (
                  "," +
                  i.selectorText.split("::").join(":").toLowerCase() +
                  ","
                ).indexOf(e)
            ) {
              if (!u) return i.style;
              s.push(i.style);
            }
        }
        return s;
      },
      register: s,
    };
  i() && t.registerPlugin(r), (e.CSSRulePlugin = r), (e.default = r);
  if (typeof window === "undefined" || window !== e) {
    Object.defineProperty(e, "__esModule", { value: !0 });
  } else {
    delete e.default;
  }
});
const getProgress = (t) => {
    let {
        position: e,
        top: r,
        bottom: i,
        scale: n = 100,
        max: o = !1,
        min: a = !1,
      } = t,
      s = ((e - r) * n) / (i - r);
    return (
      !1 !== o && (s = Math.max(s, o)), !1 !== a && (s = Math.min(s, a)), s
    );
  },
  getTop = (t) => {
    if ("undefined" === t || !t) return;
    void 0 !== t.jquery && (t = t.get()[0]);
    let e = 0;
    if (t) for (; t.parentNode; ) (e += t.offsetTop), (t = t.parentNode);
    return e;
  },
  getHeight = (t) =>
    "undefined" !== t && t
      ? (void 0 !== t.jquery && (t = t.get()[0]), t.offsetHeight)
      : void 0,
  getVisibility = (t) => {
    let e = t.getBoundingClientRect(),
      r =
        e.bottom >= 0 &&
        e.top <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        e.right >= 0 &&
        e.left <= (window.innerWidth || document.documentElement.clientWidth);
    return r;
  },
  loadImage = (t) => {
    if ("undefined" !== t && t)
      return (
        void 0 !== t.jquery && (t = t.get()[0]),
        !t.loaded_src &&
          (t.getAttribute("data-src") &&
            (t.setAttribute("src", t.getAttribute("data-src")),
            t.removeAttribute("data-src")),
          t.getAttribute("data-srcset") &&
            (t.setAttribute("srcset", t.getAttribute("data-srcset")),
            t.removeAttribute("data-srcset")),
          (t.loaded_src = !0),
          t.hasOwnProperty("loaded_callback") && t.loaded_callback(t),
          !0)
      );
  },
  get_src = (t, e, r = !0) => {
    if (!t) return 'src=""';
    let i = this.get_srcimg(t, e),
      n = this.get_srcset(t);
    return (
      (r ? "data-" : "") +
      'src="' +
      i +
      '" ' +
      (!!r && "data-") +
      'srcset="' +
      n +
      '"'
    );
  },
  get_srcset = (t) => {
    if (!t) return !1;
    let e = [];
    return (
      ["2048x2048", "1536x1536", "large", "medium_large", "medium"].forEach(
        (r) => {
          e.push(t[r] + " " + t[r + "-width"] + "w");
        }
      ),
      e.join(",\n")
    );
  },
  get_srcimg = (t, e) => !!t && t[e];
Object.defineProperty(HTMLMediaElement.prototype, "playing", {
  get: function () {
    return !!(
      this.currentTime > 0 &&
      !this.paused &&
      !this.ended &&
      this.readyState > 2
    );
  },
});
const is_touch_device = () =>
    navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0,
  get_device = () => {
    let t = navigator.userAgent.toLowerCase(),
      e = /iphone|ipod|android.*mobile|windows phone|blackberry.*mobile/i.test(
        t
      ),
      r = /ipad|android(?!.*mobile)|tablet|kindle|silk/i.test(t),
      i = !e && !r;
    return e ? "mobile" : r ? "tablet" : i ? "desktop" : "";
  },
  swipe = () => {
    ($.fn.swipe = function () {
      var t, e;
      this.on("touchstart", function (e) {
        t = e.originalEvent.touches[0].clientX;
      }),
        this.on("touchend", function (r) {
          Math.abs(t - (e = r.originalEvent.changedTouches[0].clientX)) > 50 &&
            $(this).trigger(t > e ? "swipe-left" : "swipe-right");
        });
    }),
      $(".swipe").swipe();
  },
  getHex = (t, e = "color") => {
    void 0 !== t.jquery && (t = t.get()[0]);
    let r = window.getComputedStyle(t)[e];
    return /^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$/i.test(r)
      ? "#" +
          r
            .match(/\d+/g)
            .map((t) => parseInt(t).toString(16).padStart(2, "0"))
            .join("")
      : r;
  },
  rgbToHex = (t) =>
    /^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$/i.test(color)
      ? "#" +
        t
          .match(/\d+/g)
          .map((t) => parseInt(t).toString(16).padStart(2, "0"))
          .join("")
      : t,
  getRandom = (t, e) => Math.floor(Math.random() * (e - t + 1)) + t,
  generateHash = () => {
    let t = new Uint8Array(32);
    return (
      window.crypto.getRandomValues(t),
      Array.from(t, (t) => ("0" + t.toString(16)).slice(-2))
        .join("")
        .slice(0, 32)
    );
  },
  hashString = async (t, e = "SHA256") => {
    if ("SHA256" === e) {
      let r = new TextEncoder(),
        i = r.encode(t),
        n = await crypto.subtle.digest("SHA-256", i),
        o = Array.from(new Uint8Array(n));
      return o.map((t) => t.toString(16).padStart(2, "0")).join("");
    }
  },
  hashStrings = async (t) => {
    let e = t.map((t) => hashString(t)),
      r = await Promise.all(e),
      i = {};
    return 2 === t.length && ((i.em = r[0]), (i.ph = r[1])), i;
  },
  shuffleArray = (t) => {
    for (let e = t.length - 1; e > 0; e--) {
      let r = Math.floor(Math.random() * (e + 1));
      [t[e], t[r]] = [t[r], t[e]];
    }
    return t;
  };
function debounce(t, e = 300) {
  let r;
  return (...i) => {
    clearTimeout(r),
      (r = setTimeout(() => {
        t.apply(this, i);
      }, e));
  };
}
!(function (t, n, e, o) {
  "use strict";
  if (!n.history.pushState) {
    (t.fn.smoothState = function () {
      return this;
    }),
      (t.fn.smoothState.options = {});
    return;
  }
  if (!t.fn.smoothState) {
    var r = t("html, body"),
      a = n.console,
      s = {
        isExternal: function (t) {
          var e = t.match(
            /^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/
          );
          return (
            ("string" == typeof e[1] &&
              !!(e[1].length > 0) &&
              e[1].toLowerCase() !== n.location.protocol) ||
            ("string" == typeof e[2] &&
              !!(e[2].length > 0) &&
              e[2].replace(
                RegExp(
                  ":(" +
                    { "http:": 80, "https:": 443 }[n.location.protocol] +
                    ")?$"
                ),
                ""
              ) !== n.location.host)
          );
        },
        stripHash: function (t) {
          return t.replace(/#.*/, "");
        },
        isHash: function (t, e) {
          e = e || n.location.href;
          var o = t.indexOf("#") > -1,
            r = s.stripHash(t) === s.stripHash(e);
          return o && r;
        },
        translate: function (n) {
          var e = { dataType: "html", type: "GET" };
          return (n =
            "string" == typeof n
              ? t.extend({}, e, { url: n })
              : t.extend({}, e, n));
        },
        shouldLoadAnchor: function (t, n, e) {
          var o = t.prop("href");
          return (
            !s.isExternal(o) &&
            !s.isHash(o) &&
            !t.is(n) &&
            !t.prop("target") &&
            ("" === e || -1 !== t.prop("href").search(e))
          );
        },
        clearIfOverCapacity: function (t, n) {
          return (
            Object.keys ||
              (Object.keys = function (t) {
                var n,
                  e = [];
                for (n in t)
                  Object.prototype.hasOwnProperty.call(t, n) && e.push(n);
                return e;
              }),
            Object.keys(t).length > n && (t = {}),
            t
          );
        },
        storePageIn: function (n, e, o, r, a) {
          var s = t("<html></html>").append(t(o));
          return (
            (n[e] = {
              status: "loaded",
              title: s.find("title").first().text(),
              html: s.find("#" + a),
              doc: o,
            }),
            r && (n[e].classes = r),
            n
          );
        },
        triggerAllAnimationEndEvent: function (n, e) {
          e = " " + e;
          var o = 0,
            r = function (e) {
              t(e.delegateTarget).is(n) && (e.stopPropagation(), o++);
            },
            a = function (e) {
              t(e.delegateTarget).is(n) &&
                (e.stopPropagation(), 0 == --o && n.trigger("allanimationend"));
            };
          n.on(
            "animationstart webkitAnimationStart oanimationstart MSAnimationStart",
            r
          ),
            n.on(
              "animationend webkitAnimationEnd oanimationend MSAnimationEnd",
              a
            ),
            n.on("allanimationend" + e, function () {
              (o = 0), s.redraw(n);
            });
        },
        redraw: function (t) {
          t.height();
        },
      },
      i = function (o) {
        if (null !== o.state) {
          (Website._register.transition.history[
            Website._register.transition.current
          ] = e.getElementById("scrollWrapper").scrollTop),
            (Website._register.transition.current = o.state.uid || 0);
          var r = n.location.href,
            a = t("#" + o.state.id).data("smoothState");
          Website.transition._init({ destination: r }),
            a.href === r || s.isHash(r, a.href) || a.load(r, !1);
        }
      },
      l = function (o, i) {
        var l,
          c = t(o),
          u = i.trigger_container,
          h = c.prop("id"),
          d = null,
          f = !1,
          p = function (t) {
            i.blacklist = t;
          },
          g = {},
          m = n.location.href,
          y = function (t) {
            (t = t || !1) && g.hasOwnProperty(t) ? delete g[t] : (g = {}),
              (c.data("smoothState").cache = g);
          },
          v = function (n, e) {
            e = e || t.noop;
            var o = s.translate(n);
            if (
              !(g = s.clearIfOverCapacity(g, i.cacheLength)).hasOwnProperty(
                o.url
              ) ||
              void 0 !== o.data
            ) {
              g[o.url] = { status: "fetching" };
              var r = t.ajax(o);
              r.success(function (t) {
                s.storePageIn(
                  g,
                  o.url,
                  t,
                  t.match(/body\sclass=['|"]([^'|"]*)['|"]/),
                  h
                ),
                  (c.data("smoothState").cache = g);
              }),
                r.error(function () {
                  g[o.url].status = "error";
                }),
                e && r.complete(e);
            }
          },
          S = function () {
            if (d) {
              var n = t(d, c);
              if (n.length) {
                var e = n.offset().top;
                r.scrollTop(e);
              }
              d = null;
            }
          },
          $ = function (o) {
            var s = g[o] ? g[o].html.html() : null;
            s && t(s.length)
              ? ((e.title = g[o].title),
                (c.data("smoothState").href = o),
                i.loadingClass && r.removeClass(i.loadingClass),
                i.onReady.render(c, s, g[o].classes, g[o] ? g[o].title : "", o),
                c.one("ss.onReadyEnd", function () {
                  (f = !1),
                    i.onAfter(c, s, g[o].classes, o, g[o] ? g[o].title : ""),
                    i.scroll && S();
                }),
                n.setTimeout(function () {
                  c.trigger("ss.onReadyEnd");
                }, i.onReady.duration))
              : !s && i.debug && a
              ? a.warn(
                  "No element with an id of #" +
                    h +
                    " in response from " +
                    o +
                    " in " +
                    g
                )
              : (n.location = o);
          },
          E = function (t, o, l) {
            i.href = t.url;
            var u = s.translate(t);
            void 0 === o && (o = !0), void 0 === l && (l = !0);
            var d = !1,
              f = !1,
              p = {
                loaded: function () {
                  var t = d ? "ss.onProgressEnd" : "ss.onStartEnd";
                  if (
                    (f && d
                      ? f && $(u.url)
                      : c.one(t, function () {
                          $(u.url), l || y(u.url);
                        }),
                    o)
                  ) {
                    let r = n.history.state.uid || "0",
                      a = generateHash();
                    (Website._register.transition.history[r] =
                      e.getElementById("scrollWrapper").scrollTop),
                      (Website._register.transition.current = a),
                      n.history.pushState(
                        { id: h, uid: a },
                        g[u.url].title,
                        u.url
                      );
                  }
                  f && !l && y(u.url);
                },
                fetching: function () {
                  d ||
                    ((d = !0),
                    c.one("ss.onStartEnd", function () {
                      i.loadingClass && r.addClass(i.loadingClass),
                        i.onProgress.render(c),
                        n.setTimeout(function () {
                          c.trigger("ss.onProgressEnd"), (f = !0);
                        }, i.onProgress.duration);
                    })),
                    n.setTimeout(function () {
                      g.hasOwnProperty(u.url) && p[g[u.url].status]();
                    }, 10);
                },
                error: function () {
                  i.debug && a
                    ? a.log("There was an error loading: " + u.url)
                    : (n.location = u.url);
                },
              };
            g.hasOwnProperty(u.url) || v(u),
              i.onStart.render(c),
              n.setTimeout(function () {
                i.scroll && r.scrollTop(0), c.trigger("ss.onStartEnd");
              }, i.onStart.duration),
              p[g[u.url].status]();
          },
          w = function (n) {
            var e,
              o = t(n.currentTarget);
            s.shouldLoadAnchor(o, i.blacklist, i.hrefRegex) &&
              !f &&
              (n.stopPropagation(),
              (e = s.translate(o.prop("href"))),
              v((e = i.alterRequest(e))));
          },
          P = function (n) {
            var e = t(n.currentTarget);
            if (
              !n.metaKey &&
              !n.ctrlKey &&
              s.shouldLoadAnchor(e, i.blacklist, i.hrefRegex) &&
              (n.stopPropagation(), n.preventDefault(), !T())
            ) {
              C();
              var o = s.translate(e.prop("href"));
              (f = !0),
                (d = e.prop("hash")),
                (o = i.alterRequest(o)),
                i.onBefore(e, c, o.url),
                E(o);
            }
          },
          b = 0,
          T = function () {
            var t = null === i.repeatDelay,
              n = parseInt(Date.now()) > b;
            return !(t || n);
          },
          C = function () {
            b = parseInt(Date.now()) + parseInt(i.repeatDelay);
          },
          _ = function () {
            var t = c.prop("class");
            c.removeClass(t), s.redraw(c), c.addClass(t);
          };
        return (
          (i = t.extend({}, t.fn.smoothState.options, i)),
          null === n.history.state &&
            n.history.replaceState({ id: h }, e.title, m),
          s.storePageIn(
            g,
            m,
            e.documentElement.outerHTML,
            t(e).find("body").attr("class"),
            h
          ),
          s.triggerAllAnimationEndEvent(
            c,
            "ss.onStartEnd ss.onProgressEnd ss.onEndEnd"
          ),
          (l = u),
          i.anchors &&
            (l.on("click", i.anchors, P),
            i.prefetch && l.on(i.prefetchOn, i.anchors, w)),
          {
            href: m,
            blacklist: p,
            cache: g,
            clear: y,
            load: E,
            fetch: v,
            restartCSSAnimations: _,
          }
        );
      },
      c = function (n) {
        return this.each(function () {
          var e = this.tagName.toLowerCase();
          this.id &&
          "body" !== e &&
          "html" !== e &&
          !t.data(this, "smoothState")
            ? t.data(this, "smoothState", new l(this, n))
            : !this.id && a
            ? a.warn(
                "Every smoothState container needs an id but the following one does not have one:",
                this
              )
            : ("body" === e || "html" === e) &&
              a &&
              a.warn(
                "The smoothstate container cannot be the " +
                  this.tagName +
                  " tag"
              );
        });
      };
    (n.onpopstate = i),
      (t.smoothStateUtility = s),
      (t.fn.smoothState = c),
      (t.fn.smoothState.options = {
        debug: !1,
        anchors: "a",
        hrefRegex: "",
        forms: "form",
        allowFormCaching: !1,
        repeatDelay: 500,
        blacklist: ".no-smoothState",
        prefetch: !1,
        prefetchOn: "mouseover touchstart",
        cacheLength: 0,
        loadingClass: "is-loading",
        scroll: !0,
        alterRequest: function (t) {
          return t;
        },
        onBefore: function (t, n) {},
        onStart: { duration: 0, render: function (t) {} },
        onProgress: { duration: 0, render: function (t) {} },
        onReady: {
          duration: 0,
          render: function (t, n, e, o, r) {
            t.html(n);
          },
        },
        onAfter: function (t, n) {},
      });
  }
})(jQuery, window, document);
function _defineProperties(n, t) {
  for (var e = 0; e < t.length; e++) {
    var i = t[e];
    (i.enumerable = i.enumerable || !1),
      (i.configurable = !0),
      "value" in i && (i.writable = !0),
      Object.defineProperty(n, i.key, i);
  }
}
function _createClass(n, t, e) {
  return (
    t && _defineProperties(n.prototype, t),
    e && _defineProperties(n, e),
    Object.defineProperty(n, "prototype", { writable: !1 }),
    n
  );
}
!(function (n, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define(t)
    : ((n = "undefined" != typeof globalThis ? globalThis : n || self).Splide =
        t());
})(this, function () {
  "use strict";
  var n = "(prefers-reduced-motion: reduce)";
  function t(n) {
    n.length = 0;
  }
  function e(n, t, e) {
    return Array.prototype.slice.call(n, t, e);
  }
  function i(n) {
    return n.bind.apply(n, [null].concat(e(arguments, 1)));
  }
  var o = setTimeout,
    r = function n() {};
  function u(n) {
    return requestAnimationFrame(n);
  }
  function s(n, t) {
    return typeof t === n;
  }
  function a(n) {
    return !v(n) && s("object", n);
  }
  var c = Array.isArray,
    f = i(s, "function"),
    l = i(s, "string"),
    d = i(s, "undefined");
  function v(n) {
    return null === n;
  }
  function p(n) {
    try {
      return n instanceof (n.ownerDocument.defaultView || window).HTMLElement;
    } catch (t) {
      return !1;
    }
  }
  function h(n) {
    return c(n) ? n : [n];
  }
  function g(n, t) {
    h(n).forEach(t);
  }
  function $(n, t) {
    return n.indexOf(t) > -1;
  }
  function m(n, t) {
    return n.push.apply(n, h(t)), n;
  }
  function _(n, t, e) {
    n &&
      g(t, function (t) {
        t && n.classList[e ? "add" : "remove"](t);
      });
  }
  function y(n, t) {
    _(n, l(t) ? t.split(" ") : t, !0);
  }
  function b(n, t) {
    g(t, n.appendChild.bind(n));
  }
  function w(n, t) {
    g(n, function (n) {
      var e = (t || n).parentNode;
      e && e.insertBefore(n, t);
    });
  }
  function E(n, t) {
    return p(n) && (n.msMatchesSelector || n.matches).call(n, t);
  }
  function x(n, t) {
    var i = n ? e(n.children) : [];
    return t
      ? i.filter(function (n) {
          return E(n, t);
        })
      : i;
  }
  function S(n, t) {
    return t ? x(n, t)[0] : n.firstElementChild;
  }
  var P = Object.keys;
  function C(n, t, e) {
    return (
      n &&
        (e ? P(n).reverse() : P(n)).forEach(function (e) {
          "__proto__" !== e && t(n[e], e);
        }),
      n
    );
  }
  function k(n) {
    return (
      e(arguments, 1).forEach(function (t) {
        C(t, function (e, i) {
          n[i] = t[i];
        });
      }),
      n
    );
  }
  function L(n) {
    return (
      e(arguments, 1).forEach(function (t) {
        C(t, function (t, e) {
          c(t)
            ? (n[e] = t.slice())
            : a(t)
            ? (n[e] = L({}, a(n[e]) ? n[e] : {}, t))
            : (n[e] = t);
        });
      }),
      n
    );
  }
  function A(n, t) {
    g(t || P(n), function (t) {
      delete n[t];
    });
  }
  function D(n, t) {
    g(n, function (n) {
      g(t, function (t) {
        n && n.removeAttribute(t);
      });
    });
  }
  function z(n, t, e) {
    a(t)
      ? C(t, function (t, e) {
          z(n, e, t);
        })
      : g(n, function (n) {
          v(e) || "" === e ? D(n, t) : n.setAttribute(t, String(e));
        });
  }
  function I(n, t, e) {
    var i = document.createElement(n);
    return t && (l(t) ? y(i, t) : z(i, t)), e && b(e, i), i;
  }
  function N(n, t, e) {
    if (d(e)) return getComputedStyle(n)[t];
    v(e) || (n.style[t] = "" + e);
  }
  function M(n, t) {
    N(n, "display", t);
  }
  function T(n) {
    (n.setActive && n.setActive()) || n.focus({ preventScroll: !0 });
  }
  function O(n, t) {
    return n.getAttribute(t);
  }
  function R(n, t) {
    return n && n.classList.contains(t);
  }
  function X(n) {
    return n.getBoundingClientRect();
  }
  function F(n) {
    g(n, function (n) {
      n && n.parentNode && n.parentNode.removeChild(n);
    });
  }
  function W(n) {
    return S(new DOMParser().parseFromString(n, "text/html").body);
  }
  function j(n, t) {
    n.preventDefault(),
      t && (n.stopPropagation(), n.stopImmediatePropagation());
  }
  function G(n, t) {
    return n && n.querySelector(t);
  }
  function B(n, t) {
    return t ? e(n.querySelectorAll(t)) : [];
  }
  function Y(n, t) {
    _(n, t, !1);
  }
  function H(n) {
    return n.timeStamp;
  }
  function U(n) {
    return l(n) ? n : n ? n + "px" : "";
  }
  var q = "splide",
    K = "data-" + q;
  function V(n, t) {
    if (!n) throw Error("[" + q + "] " + (t || ""));
  }
  var J = Math.min,
    Q = Math.max,
    Z = Math.floor,
    nn = Math.ceil,
    nt = Math.abs;
  function ne(n, t, e) {
    return nt(n - t) < e;
  }
  function ni(n, t, e, i) {
    var o = J(t, e),
      r = Q(t, e);
    return i ? o < n && n < r : o <= n && n <= r;
  }
  function no(n, t, e) {
    var i = J(t, e),
      o = Q(t, e);
    return J(Q(i, n), o);
  }
  function nr(n) {
    return +(n > 0) - +(n < 0);
  }
  function nu(n, t) {
    return (
      g(t, function (t) {
        n = n.replace("%s", "" + t);
      }),
      n
    );
  }
  function ns(n) {
    return n < 10 ? "0" + n : "" + n;
  }
  var na = {};
  function nc() {
    var n = [];
    function e(n, t, e) {
      g(n, function (n) {
        n &&
          g(t, function (t) {
            t.split(" ").forEach(function (t) {
              var i = t.split(".");
              e(n, i[0], i[1]);
            });
          });
      });
    }
    return {
      bind: function t(i, o, r, u) {
        e(i, o, function (t, e, i) {
          var o = "addEventListener" in t,
            s = o
              ? t.removeEventListener.bind(t, e, r, u)
              : t.removeListener.bind(t, r);
          o ? t.addEventListener(e, r, u) : t.addListener(r),
            n.push([t, e, i, r, s]);
        });
      },
      unbind: function t(i, o, r) {
        e(i, o, function (t, e, i) {
          n = n.filter(function (n) {
            return (
              n[0] !== t ||
              n[1] !== e ||
              n[2] !== i ||
              (!!r && n[3] !== r) ||
              (n[4](), !1)
            );
          });
        });
      },
      dispatch: function n(t, e, i) {
        var o;
        return (
          "function" == typeof CustomEvent
            ? (o = new CustomEvent(e, { bubbles: !0, detail: i }))
            : (o = document.createEvent("CustomEvent")).initCustomEvent(
                e,
                !0,
                !1,
                i
              ),
          t.dispatchEvent(o),
          o
        );
      },
      destroy: function e() {
        n.forEach(function (n) {
          n[4]();
        }),
          t(n);
      },
    };
  }
  var nf = "mounted",
    nl = "ready",
    nd = "move",
    nv = "moved",
    np = "click",
    nh = "refresh",
    ng = "updated",
    n$ = "resize",
    nm = "resized",
    n_ = "scroll",
    ny = "scrolled",
    nb = "destroy",
    nw = "navigation:mounted",
    nE = "autoplay:play",
    nx = "autoplay:pause",
    nS = "lazyload:loaded";
  function nP(n) {
    var t = n ? n.event.bus : document.createDocumentFragment(),
      o = nc();
    return (
      n && n.event.on(nb, o.destroy),
      k(o, {
        bus: t,
        on: function n(e, i) {
          o.bind(t, h(e).join(" "), function (n) {
            i.apply(i, c(n.detail) ? n.detail : []);
          });
        },
        off: i(o.unbind, t),
        emit: function n(i) {
          o.dispatch(t, i, e(arguments, 1));
        },
      })
    );
  }
  function nC(n, t, e, i) {
    var o,
      r,
      s = Date.now,
      a = 0,
      c = !0,
      f = 0;
    function l() {
      if (!c) {
        if (
          ((a = n ? J((s() - o) / n, 1) : 1),
          e && e(a),
          a >= 1 && (t(), (o = s()), i && ++f >= i))
        )
          return d();
        r = u(l);
      }
    }
    function d() {
      c = !0;
    }
    function v() {
      r && cancelAnimationFrame(r), (a = 0), (r = 0), (c = !0);
    }
    function p(t) {
      n = t;
    }
    function h() {
      return c;
    }
    return {
      start: function t(e) {
        e || v(), (o = s() - (e ? a * n : 0)), (c = !1), (r = u(l));
      },
      rewind: function n() {
        (o = s()), (a = 0), e && e(a);
      },
      pause: d,
      cancel: v,
      set: p,
      isPaused: h,
    };
  }
  var nk = "Arrow",
    n8 = nk + "Left",
    nL = nk + "Right",
    n2 = nk + "Up",
    nA = nk + "Down",
    nD = {
      width: ["height"],
      left: ["top", "right"],
      right: ["bottom", "left"],
      x: ["y"],
      X: ["Y"],
      Y: ["X"],
      ArrowLeft: [n2, nL],
      ArrowRight: [nA, n8],
    },
    nz = "role",
    nI = "tabindex",
    nN = "aria-",
    nM = nN + "controls",
    nT = nN + "current",
    nO = nN + "selected",
    n3 = nN + "label",
    nR = nN + "labelledby",
    n1 = nN + "hidden",
    nX = nN + "orientation",
    n0 = nN + "roledescription",
    n4 = nN + "live",
    nF = nN + "busy",
    nW = nN + "atomic",
    nj = [nz, nI, "disabled", nM, nT, n3, nR, n1, nX, n0],
    nG = q + "__",
    n6 = q,
    nB = nG + "track",
    nY = nG + "list",
    nH = nG + "slide",
    nU = nH + "--clone",
    n5 = nH + "__container",
    nq = nG + "arrows",
    nK = nG + "arrow",
    nV = nK + "--prev",
    n7 = nK + "--next",
    nJ = nG + "pagination",
    nQ = nJ + "__page",
    nZ = nG + "progress__bar",
    n9 = nG + "toggle",
    tn = nG + "sr",
    tt = "is-active",
    te = "is-prev",
    ti = "is-next",
    to = "is-visible",
    tr = "is-loading",
    tu = "is-focus-in",
    ts = "is-overflow",
    ta = [tt, to, te, ti, tr, tu, ts],
    tc = "touchstart mousedown",
    tf = "touchmove mousemove",
    tl = "touchend touchcancel mouseup click",
    td = "slide",
    tv = "loop",
    tp = "fade",
    th = K + "-interval",
    tg = { passive: !1, capture: !0 },
    t$ = { Spacebar: " ", Right: nL, Left: n8, Up: n2, Down: nA };
  function tm(n) {
    return t$[(n = l(n) ? n : n.key)] || n;
  }
  var t_ = "keydown",
    ty = K + "-lazy",
    tb = ty + "-srcset",
    tw = "[" + ty + "], [" + tb + "]",
    tE = [" ", "Enter"],
    tx = Object.freeze({
      __proto__: null,
      Media: function t(e, i, o) {
        var r = e.state,
          u = o.breakpoints || {},
          s = o.reducedMotion || {},
          a = nc(),
          c = [];
        function f(n) {
          n && a.destroy();
        }
        function l(n, t) {
          var e = matchMedia(t);
          a.bind(e, "change", d), c.push([n, e]);
        }
        function d() {
          var n = r.is(7),
            t = o.direction,
            i = c.reduce(function (n, t) {
              return L(n, t[1].matches ? t[0] : {});
            }, {});
          A(o),
            v(i),
            o.destroy
              ? e.destroy("completely" === o.destroy)
              : n
              ? (f(!0), e.mount())
              : t !== o.direction && e.refresh();
        }
        function v(n, t, i) {
          L(o, n),
            t && L(Object.getPrototypeOf(o), n),
            (i || !r.is(1)) && e.emit(ng, o);
        }
        return {
          setup: function t() {
            var e = "min" === o.mediaQuery;
            P(u)
              .sort(function (n, t) {
                return e ? +n - +t : +t - +n;
              })
              .forEach(function (n) {
                l(u[n], "(" + (e ? "min" : "max") + "-width:" + n + "px)");
              }),
              l(s, n),
              d();
          },
          destroy: f,
          reduce: function t(e) {
            matchMedia(n).matches && (e ? L(o, s) : A(o, P(s)));
          },
          set: v,
        };
      },
      Direction: function n(t, e, i) {
        return {
          resolve: function n(t, e, o) {
            var r =
              "rtl" !== (o = o || i.direction) || e
                ? "ttb" === o
                  ? 0
                  : -1
                : 1;
            return (
              (nD[t] && nD[t][r]) ||
              t.replace(/width|left|right/i, function (n, t) {
                var e = nD[n.toLowerCase()][r] || n;
                return t > 0 ? e.charAt(0).toUpperCase() + e.slice(1) : e;
              })
            );
          },
          orient: function n(t) {
            return t * ("rtl" === i.direction ? 1 : -1);
          },
        };
      },
      Elements: function n(e, i, o) {
        var r,
          u,
          s,
          a = nP(e),
          c = a.on,
          l = a.bind,
          d = e.root,
          v = o.i18n,
          p = {},
          h = [],
          g = [],
          $ = [];
        function b() {
          var n, t, e;
          (r = L("." + nB)),
            (u = S(r, "." + nY)),
            V(r && u, "A track/list element is missing."),
            m(h, x(u, "." + nH + ":not(." + nU + ")")),
            C(
              {
                arrows: nq,
                pagination: nJ,
                prev: nV,
                next: n7,
                bar: nZ,
                toggle: n9,
              },
              function (n, t) {
                p[t] = L("." + n);
              }
            ),
            k(p, { root: d, track: r, list: u, slides: h }),
            (t = d.id || "" + (n = q) + ns((na[n] = (na[n] || 0) + 1))),
            (e = o.role),
            (d.id = t),
            (r.id = r.id || t + "-track"),
            (u.id = u.id || t + "-list"),
            !O(d, nz) && "SECTION" !== d.tagName && e && z(d, nz, e),
            z(d, n0, v.carousel),
            z(u, nz, "presentation"),
            P();
        }
        function w(n) {
          var e = nj.concat("style");
          t(h), Y(d, g), Y(r, $), D([r, u], e), D(d, n ? e : ["style", n0]);
        }
        function P() {
          Y(d, g),
            Y(r, $),
            (g = A(n6)),
            ($ = A(nB)),
            y(d, g),
            y(r, $),
            z(d, n3, o.label),
            z(d, nR, o.labelledby);
        }
        function L(n) {
          var t = G(d, n);
          return t &&
            (function n(t, e) {
              if (f(t.closest)) return t.closest(e);
              for (var i = t; i && 1 === i.nodeType && !E(i, e); )
                i = i.parentElement;
              return i;
            })(t, "." + n6) === d
            ? t
            : void 0;
        }
        function A(n) {
          return [
            n + "--" + o.type,
            n + "--" + o.direction,
            o.drag && n + "--draggable",
            o.isNavigation && n + "--nav",
            n === n6 && tt,
          ];
        }
        return k(p, {
          setup: b,
          mount: function n() {
            c(nh, w),
              c(nh, b),
              c(ng, P),
              l(
                document,
                tc + " keydown",
                function (n) {
                  s = "keydown" === n.type;
                },
                { capture: !0 }
              ),
              l(d, "focusin", function () {
                _(d, tu, !!s);
              });
          },
          destroy: w,
        });
      },
      Slides: function n(e, o, r) {
        var u = nP(e),
          s = u.on,
          a = u.emit,
          c = u.bind,
          d = o.Elements,
          v = d.slides,
          m = d.list,
          x = [];
        function P() {
          v.forEach(function (n, t) {
            k(n, t, -1);
          });
        }
        function C() {
          A(function (n) {
            n.destroy();
          }),
            t(x);
        }
        function k(n, t, o) {
          var r = (function n(t, e, o, r) {
            var u,
              s = nP(t),
              a = s.on,
              c = s.emit,
              f = s.bind,
              l = t.Components,
              d = t.root,
              v = t.options,
              p = v.isNavigation,
              h = v.updateOnMove,
              g = v.i18n,
              $ = v.pagination,
              m = v.slideFocus,
              y = l.Direction.resolve,
              b = O(r, "style"),
              w = O(r, n3),
              E = o > -1,
              x = S(r, "." + n5);
            function P() {
              var n = t.splides
                .map(function (n) {
                  var t = n.splide.Components.Slides.getAt(e);
                  return t ? t.slide.id : "";
                })
                .join(" ");
              z(r, n3, nu(g.slideX, (E ? o : e) + 1)),
                z(r, nM, n),
                z(r, nz, m ? "button" : ""),
                m && D(r, n0);
            }
            function C() {
              u || k();
            }
            function k() {
              if (!u) {
                var n,
                  i = t.index;
                (n = L()) !== R(r, tt) &&
                  (_(r, tt, n),
                  z(r, nT, (p && n) || ""),
                  c(n ? "active" : "inactive", A)),
                  (function n() {
                    var e = (function n() {
                        if (t.is(tp)) return L();
                        var e = X(l.Elements.track),
                          i = X(r),
                          o = y("left", !0),
                          u = y("right", !0);
                        return Z(e[o]) <= nn(i[o]) && Z(i[u]) <= nn(e[u]);
                      })(),
                      i = !e && (!L() || E);
                    if (
                      (t.state.is([4, 5]) || z(r, n1, i || ""),
                      z(B(r, v.focusableNodes || ""), nI, i ? -1 : ""),
                      m && z(r, nI, i ? -1 : 0),
                      e !== R(r, to) &&
                        (_(r, to, e), c(e ? "visible" : "hidden", A)),
                      !e && document.activeElement === r)
                    ) {
                      var o = l.Slides.getAt(t.index);
                      o && T(o.slide);
                    }
                  })(),
                  _(r, te, e === i - 1),
                  _(r, ti, e === i + 1);
              }
            }
            function L() {
              var n = t.index;
              return n === e || (v.cloneStatus && n === o);
            }
            var A = {
              index: e,
              slideIndex: o,
              slide: r,
              container: x,
              isClone: E,
              mount: function n() {
                E ||
                  ((r.id = d.id + "-slide" + ns(e + 1)),
                  z(r, nz, $ ? "tabpanel" : "group"),
                  z(r, n0, g.slide),
                  z(r, n3, w || nu(g.slideLabel, [e + 1, t.length]))),
                  f(r, "click", i(c, np, A)),
                  f(r, "keydown", i(c, "sk", A)),
                  a([nv, "sh", ny], k),
                  a(nw, P),
                  h && a(nd, C);
              },
              destroy: function n() {
                (u = !0),
                  s.destroy(),
                  Y(r, ta),
                  D(r, nj),
                  z(r, "style", b),
                  z(r, n3, w || "");
              },
              update: k,
              style: function n(t, e, i) {
                N((i && x) || r, t, e);
              },
              isWithin: function n(i, o) {
                var r = nt(i - e);
                return (
                  !E && (v.rewind || t.is(tv)) && (r = J(r, t.length - r)),
                  r <= o
                );
              },
            };
            return A;
          })(e, t, o, n);
          r.mount(),
            x.push(r),
            x.sort(function (n, t) {
              return n.index - t.index;
            });
        }
        function L(n) {
          return n
            ? I(function (n) {
                return !n.isClone;
              })
            : x;
        }
        function A(n, t) {
          L(t).forEach(n);
        }
        function I(n) {
          return x.filter(
            f(n)
              ? n
              : function (t) {
                  return l(n) ? E(t.slide, n) : $(h(n), t.index);
                }
          );
        }
        return {
          mount: function n() {
            P(), s(nh, C), s(nh, P);
          },
          destroy: C,
          update: function n() {
            A(function (n) {
              n.update();
            });
          },
          register: k,
          get: L,
          getIn: function n(t) {
            var e = o.Controller,
              i = e.toIndex(t),
              u = e.hasFocus() ? 1 : r.perPage;
            return I(function (n) {
              return ni(n.index, i, i + u - 1);
            });
          },
          getAt: function n(t) {
            return I(t)[0];
          },
          add: function n(t, e) {
            g(t, function (n) {
              if ((l(n) && (n = W(n)), p(n))) {
                var t,
                  o,
                  u,
                  s,
                  f = v[e];
                f ? w(n, f) : b(m, n),
                  y(n, r.classes.slide),
                  (t = n),
                  (o = i(a, n$)),
                  (s = (u = B(t, "img")).length)
                    ? u.forEach(function (n) {
                        c(n, "load error", function () {
                          --s || o();
                        });
                      })
                    : o();
              }
            }),
              a(nh);
          },
          remove: function n(t) {
            F(
              I(t).map(function (n) {
                return n.slide;
              })
            ),
              a(nh);
          },
          forEach: A,
          filter: I,
          style: function n(t, e, i) {
            A(function (n) {
              n.style(t, e, i);
            });
          },
          getLength: function n(t) {
            return t ? v.length : x.length;
          },
          isEnough: function n() {
            return x.length > r.perPage;
          },
        };
      },
      Layout: function n(t, e, o) {
        var r,
          u,
          s,
          c = nP(t),
          f = c.on,
          l = c.bind,
          d = c.emit,
          v = e.Slides,
          p = e.Direction.resolve,
          h = e.Elements,
          g = h.root,
          $ = h.track,
          m = h.list,
          y = v.getAt,
          b = v.style;
        function w() {
          (r = "ttb" === o.direction),
            N(g, "maxWidth", U(o.width)),
            N($, p("paddingLeft"), x(!1)),
            N($, p("paddingRight"), x(!0)),
            E(!0);
        }
        function E(n) {
          var t,
            e = X(g);
          (n || u.width !== e.width || u.height !== e.height) &&
            (N(
              $,
              "height",
              ((t = ""),
              r &&
                ((t = S()),
                V(t, "height or heightRatio is missing."),
                (t = "calc(" + t + " - " + x(!1) + " - " + x(!0) + ")")),
              t)
            ),
            b(p("marginRight"), U(o.gap)),
            b("width", o.autoWidth ? null : U(o.fixedWidth) || (r ? "" : P())),
            b(
              "height",
              U(o.fixedHeight) || (r ? (o.autoHeight ? null : P()) : S()),
              !0
            ),
            (u = e),
            d(nm),
            s !== (s = z()) && (_(g, ts, s), d("overflow", s)));
        }
        function x(n) {
          var t = o.padding,
            e = p(n ? "right" : "left");
          return (t && U(t[e] || (a(t) ? 0 : t))) || "0px";
        }
        function S() {
          return U(o.height || X(m).width * o.heightRatio);
        }
        function P() {
          var n = U(o.gap);
          return (
            "calc((100%" +
            (n && " + " + n) +
            ")/" +
            (o.perPage || 1) +
            (n && " - " + n) +
            ")"
          );
        }
        function C() {
          return X(m)[p("width")];
        }
        function k(n, t) {
          var e = y(n || 0);
          return e ? X(e.slide)[p("width")] + (t ? 0 : D()) : 0;
        }
        function L(n, t) {
          var e = y(n);
          if (e) {
            var i = X(e.slide)[p("right")],
              o = X(m)[p("left")];
            return nt(i - o) + (t ? 0 : D());
          }
          return 0;
        }
        function A(n) {
          return L(t.length - 1) - L(0) + k(0, n);
        }
        function D() {
          var n = y(0);
          return (n && parseFloat(N(n.slide, p("marginRight")))) || 0;
        }
        function z() {
          return t.is(tp) || A(!0) > C();
        }
        return {
          mount: function n() {
            var t, e;
            w(),
              l(
                window,
                "resize load",
                ((t = i(d, n$)),
                (e = nC(0, t, null, 1)),
                function () {
                  e.isPaused() && e.start();
                })
              ),
              f([ng, nh], w),
              f(n$, E);
          },
          resize: E,
          listSize: C,
          slideSize: k,
          sliderSize: A,
          totalSize: L,
          getPadding: function n(t) {
            return parseFloat(N($, p("padding" + (t ? "Right" : "Left")))) || 0;
          },
          isOverflow: z,
        };
      },
      Clones: function n(e, i, o) {
        var r,
          u = nP(e),
          s = u.on,
          a = i.Elements,
          c = i.Slides,
          f = i.Direction.resolve,
          l = [];
        function v() {
          s(nh, p),
            s([ng, n$], g),
            (r = $()) &&
              ((function n(t) {
                var i = c.get().slice(),
                  r = i.length;
                if (r) {
                  for (; i.length < t; ) m(i, i);
                  m(i.slice(-t), i.slice(0, t)).forEach(function (n, u) {
                    var s,
                      f,
                      d,
                      v = u < t,
                      p =
                        ((s = n.slide),
                        (f = u),
                        (d = s.cloneNode(!0)),
                        y(d, o.classes.clone),
                        (d.id = e.root.id + "-clone" + ns(f + 1)),
                        d);
                    v ? w(p, i[0].slide) : b(a.list, p),
                      m(l, p),
                      c.register(p, u - t + (v ? 0 : r), n.index);
                  });
                }
              })(r),
              i.Layout.resize(!0));
        }
        function p() {
          h(), v();
        }
        function h() {
          F(l), t(l), u.destroy();
        }
        function g() {
          var n = $();
          r !== n && (r < n || !n) && u.emit(nh);
        }
        function $() {
          var n = o.clones;
          if (e.is(tv)) {
            if (d(n)) {
              var t = o[f("fixedWidth")] && i.Layout.slideSize(0);
              n =
                (t && nn(X(a.track)[f("width")] / t)) ||
                (o[f("autoWidth")] && e.length) ||
                2 * o.perPage;
            }
          } else n = 0;
          return n;
        }
        return { mount: v, destroy: h };
      },
      Move: function n(t, e, i) {
        var o,
          r = nP(t),
          u = r.on,
          s = r.emit,
          a = t.state.set,
          c = e.Layout,
          f = c.slideSize,
          l = c.getPadding,
          v = c.totalSize,
          p = c.listSize,
          h = c.sliderSize,
          g = e.Direction,
          $ = g.resolve,
          m = g.orient,
          _ = e.Elements,
          y = _.list,
          b = _.track;
        function w() {
          e.Controller.isBusy() ||
            (e.Scroll.cancel(), E(t.index), e.Slides.update());
        }
        function E(n) {
          x(k(n, !0));
        }
        function x(n, i) {
          if (!t.is(tp)) {
            var o = i
              ? n
              : (function n(i) {
                  if (t.is(tv)) {
                    var o = C(i),
                      r = o > e.Controller.getEnd();
                    (o < 0 || r) && (i = S(i, r));
                  }
                  return i;
                })(n);
            N(y, "transform", "translate" + $("X") + "(" + o + "px)"),
              n !== o && s("sh");
          }
        }
        function S(n, t) {
          var e = n - A(t),
            i = h();
          return n - m(i * (nn(nt(e) / i) || 1)) * (t ? 1 : -1);
        }
        function P() {
          x(L(), !0), o.cancel();
        }
        function C(n) {
          for (
            var t = e.Slides.get(), i = 0, o = 1 / 0, r = 0;
            r < t.length;
            r++
          ) {
            var u = t[r].index,
              s = nt(k(u, !0) - n);
            if (s <= o) (o = s), (i = u);
            else break;
          }
          return i;
        }
        function k(n, e) {
          var o,
            r,
            u,
            s = m(
              v(n - 1) -
                ((o = n),
                (r = i.focus),
                "center" === r ? (p() - f(o, !0)) / 2 : +r * f(o) || 0)
            );
          return e
            ? ((u = s),
              i.trimSpace && t.is(td) && (u = no(u, 0, m(h(!0) - p()))),
              u)
            : s;
        }
        function L() {
          var n = $("left");
          return X(y)[n] - X(b)[n] + m(l(!1));
        }
        function A(n) {
          return k(n ? e.Controller.getEnd() : 0, !!i.trimSpace);
        }
        return {
          mount: function n() {
            (o = e.Transition), u([nf, nm, ng, nh], w);
          },
          move: function n(t, e, i, r) {
            var u, c;
            t !== e &&
              ((u = t > i),
              (c = m(S(L(), u))),
              u ? c >= 0 : c <= y[$("scrollWidth")] - X(b)[$("width")]) &&
              (P(), x(S(L(), t > i), !0)),
              a(4),
              s(nd, e, i, t),
              o.start(e, function () {
                a(3), s(nv, e, i, t), r && r();
              });
          },
          jump: E,
          translate: x,
          shift: S,
          cancel: P,
          toIndex: C,
          toPosition: k,
          getPosition: L,
          getLimit: A,
          exceededLimit: function n(t, e) {
            e = d(e) ? L() : e;
            var i = !0 !== t && m(e) < m(A(!1)),
              o = !1 !== t && m(e) > m(A(!0));
            return i || o;
          },
          reposition: w,
        };
      },
      Controller: function n(t, e, o) {
        var r,
          u,
          s,
          a,
          c,
          f = nP(t),
          v = f.on,
          p = f.emit,
          h = e.Move,
          g = h.getPosition,
          $ = h.getLimit,
          m = h.toPosition,
          _ = e.Slides,
          y = _.isEnough,
          b = _.getLength,
          w = o.omitEnd,
          E = t.is(tv),
          x = t.is(td),
          S = i(D, !1),
          P = i(D, !0),
          C = o.start || 0,
          k = C;
        function L() {
          (u = b(!0)), (s = o.perMove), (a = o.perPage), (r = N());
          var n = no(C, 0, w ? r : u - 1);
          n !== C && ((C = n), h.reposition());
        }
        function A() {
          r !== N() && p("ei");
        }
        function D(n, t) {
          var e,
            i,
            o = s || (R() ? 1 : a),
            u = z(C + o * (n ? -1 : 1), C, !(s || R()));
          if (-1 === u && x) {
            if (((e = g()), !(1 > nt(e - (i = $(!n)))))) return n ? 0 : r;
          }
          return t ? u : I(u);
        }
        function z(n, e, i) {
          if (y() || R()) {
            var c = (function n(e) {
              if (x && "move" === o.trimSpace && e !== C)
                for (
                  var i = g();
                  i === m(e, !0) && ni(e, 0, t.length - 1, !o.rewind);

                )
                  e < C ? --e : ++e;
              return e;
            })(n);
            c !== n && ((e = n), (n = c), (i = !1)),
              n < 0 || n > r
                ? (n =
                    !s && (ni(0, n, e, !0) || ni(r, e, n, !0))
                      ? M(T(n))
                      : E
                      ? i
                        ? n < 0
                          ? -(u % a || a)
                          : u
                        : n
                      : o.rewind
                      ? n < 0
                        ? r
                        : 0
                      : -1)
                : i && n !== e && (n = M(T(e) + (n < e ? -1 : 1)));
          } else n = -1;
          return n;
        }
        function I(n) {
          return E ? (n + u) % u || 0 : n;
        }
        function N() {
          for (var n = u - (R() || (E && s) ? 1 : a); w && n-- > 0; )
            if (m(u - 1, !0) !== m(n, !0)) {
              n++;
              break;
            }
          return no(n, 0, u - 1);
        }
        function M(n) {
          return no(R() ? n : a * n, 0, r);
        }
        function T(n) {
          return R() ? J(n, r) : Z((n >= r ? u - 1 : n) / a);
        }
        function O(n) {
          n !== C && ((k = C), (C = n));
        }
        function R() {
          return !d(o.focus) || o.isNavigation;
        }
        function X() {
          return t.state.is([4, 5]) && !!o.waitForTransition;
        }
        return {
          mount: function n() {
            L(), v([ng, nh, "ei"], L), v(nm, A);
          },
          go: function n(t, e, i) {
            if (!X()) {
              var o = (function n(t) {
                  var e = C;
                  if (l(t)) {
                    var i = t.match(/([+\-<>])(\d+)?/) || [],
                      o = i[1],
                      u = i[2];
                    "+" === o || "-" === o
                      ? (e = z(C + +("" + o + (+u || 1)), C))
                      : ">" === o
                      ? (e = u ? M(+u) : S(!0))
                      : "<" === o && (e = P(!0));
                  } else e = E ? t : no(t, 0, r);
                  return e;
                })(t),
                u = I(o);
              u > -1 && (e || u !== C) && (O(u), h.move(o, u, k, i));
            }
          },
          scroll: function n(t, i, o, u) {
            e.Scroll.scroll(t, i, o, function () {
              var n = I(h.toIndex(g()));
              O(w ? J(n, r) : n), u && u();
            });
          },
          getNext: S,
          getPrev: P,
          getAdjacent: D,
          getEnd: N,
          setIndex: O,
          getIndex: function n(t) {
            return t ? k : C;
          },
          toIndex: M,
          toPage: T,
          toDest: function n(t) {
            var e = h.toIndex(t);
            return x ? no(e, 0, r) : e;
          },
          hasFocus: R,
          isBusy: X,
          loop: I,
          destIndex: c,
        };
      },
      Arrows: function n(t, e, o) {
        var r,
          u,
          s = nP(t),
          a = s.on,
          c = s.bind,
          f = s.emit,
          l = o.classes,
          d = o.i18n,
          v = e.Elements,
          p = e.Controller,
          h = v.arrows,
          g = v.track,
          $ = h,
          m = v.prev,
          _ = v.next,
          E = {};
        function x() {
          var n;
          (n = o.arrows) &&
            !(m && _) &&
            (($ = h || I("div", l.arrows)),
            (m = L(!0)),
            (_ = L(!1)),
            (r = !0),
            b($, [m, _]),
            h || w($, g)),
            m &&
              _ &&
              (k(E, { prev: m, next: _ }),
              M($, n ? "" : "none"),
              y($, (u = nq + "--" + o.direction)),
              n &&
                (a([nf, nv, nh, ny, "ei"], A),
                c(_, "click", i(C, ">")),
                c(m, "click", i(C, "<")),
                A(),
                z([m, _], nM, g.id),
                f("arrows:mounted", m, _))),
            a(ng, S);
        }
        function S() {
          P(), x();
        }
        function P() {
          s.destroy(),
            Y($, u),
            r ? (F(h ? [m, _] : $), (m = _ = null)) : D([m, _], nj);
        }
        function C(n) {
          p.go(n, !0);
        }
        function L(n) {
          return W(
            '<button class="' +
              l.arrow +
              " " +
              (n ? l.prev : l.next) +
              '" type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" focusable="false"><path d="' +
              (o.arrowPath ||
                "m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z") +
              '" />'
          );
        }
        function A() {
          if (m && _) {
            var n = t.index,
              e = p.getPrev(),
              i = p.getNext(),
              o = e > -1 && n < e ? d.last : d.prev,
              r = i > -1 && n > i ? d.first : d.next;
            (m.disabled = e < 0),
              (_.disabled = i < 0),
              z(m, n3, o),
              z(_, n3, r),
              f("arrows:updated", m, _, e, i);
          }
        }
        return { arrows: E, mount: x, destroy: P, update: A };
      },
      Autoplay: function n(t, e, i) {
        var o,
          r,
          u = nP(t),
          s = u.on,
          a = u.bind,
          c = u.emit,
          f = nC(i.interval, t.go.bind(t, ">"), function n(t) {
            var e = d.bar;
            e && N(e, "width", 100 * t + "%"), c("autoplay:playing", t);
          }),
          l = f.isPaused,
          d = e.Elements,
          v = e.Elements,
          p = v.root,
          h = v.toggle,
          g = i.autoplay,
          $ = "pause" === g;
        function m() {
          l() &&
            e.Slides.isEnough() &&
            (f.start(!i.resetProgress), (r = o = $ = !1), w(), c(nE));
        }
        function y(n) {
          void 0 === n && (n = !0), ($ = !!n), w(), l() || (f.pause(), c(nx));
        }
        function b() {
          $ || (o || r ? y(!1) : m());
        }
        function w() {
          h && (_(h, tt, !$), z(h, n3, i.i18n[$ ? "play" : "pause"]));
        }
        function E(n) {
          var t = e.Slides.getAt(n);
          f.set((t && +O(t.slide, th)) || i.interval);
        }
        return {
          mount: function n() {
            g &&
              (i.pauseOnHover &&
                a(p, "mouseenter mouseleave", function (n) {
                  (o = "mouseenter" === n.type), b();
                }),
              i.pauseOnFocus &&
                a(p, "focusin focusout", function (n) {
                  (r = "focusin" === n.type), b();
                }),
              h &&
                a(h, "click", function () {
                  $ ? m() : y(!0);
                }),
              s([nd, n_, nh], f.rewind),
              s(nd, E),
              h && z(h, nM, d.track.id),
              $ || m(),
              w());
          },
          destroy: f.cancel,
          play: m,
          pause: y,
          isPaused: l,
        };
      },
      Cover: function n(t, e, o) {
        var r = nP(t).on;
        function u(n) {
          e.Slides.forEach(function (t) {
            var e = S(t.container || t.slide, "img");
            e && e.src && s(n, e, t);
          });
        }
        function s(n, t, e) {
          e.style(
            "background",
            n ? 'center/cover no-repeat url("' + t.src + '")' : "",
            !0
          ),
            M(t, n ? "none" : "");
        }
        return {
          mount: function n() {
            o.cover && (r(nS, i(s, !0)), r([nf, ng, nh], i(u, !0)));
          },
          destroy: i(u, !1),
        };
      },
      Scroll: function n(t, e, o) {
        var r,
          u,
          s = nP(t),
          a = s.on,
          c = s.emit,
          f = t.state.set,
          l = e.Move,
          d = l.getPosition,
          v = l.getLimit,
          p = l.exceededLimit,
          h = l.translate,
          g = t.is(td),
          $ = 1;
        function m(n, t, o, s, a) {
          e.Controller.destIndex = e.Controller.loop(l.toIndex(n));
          var v = d();
          if ((b(), o && (!g || !p()))) {
            var h = e.Layout.sliderSize(),
              m = nr(n) * h * Z(nt(n) / h) || 0;
            n = l.toPosition(e.Controller.toDest(n % h)) + m;
          }
          var w,
            E,
            x = ((w = v), (E = n), 1 > nt(w - E));
          ($ = 1),
            (t = x ? 0 : t || Q(nt(n - v) / 1.5, 800)),
            (u = s),
            (r = nC(t, _, i(y, v, n, a), 1)),
            f(5),
            c(n_),
            r.start();
        }
        function _() {
          f(3), u && u(), c(ny);
        }
        function y(n, t, e, i) {
          var r,
            s,
            a = d(),
            c =
              (n +
                (t - n) *
                  ((r = i),
                  (s = o.easingFunc),
                  s ? s(r) : 1 - Math.pow(1 - r, 4)) -
                a) *
              $;
          h(a + c),
            g &&
              !e &&
              p() &&
              (($ *= 0.6), 10 > nt(c) && m(v(p(!0)), 600, !1, u, !0));
        }
        function b() {
          r && r.cancel();
        }
        function w() {
          r && !r.isPaused() && (b(), _());
        }
        return {
          mount: function n() {
            a(nd, b), a([ng, nh], w);
          },
          destroy: b,
          scroll: m,
          cancel: w,
        };
      },
      Drag: function n(t, e, i) {
        var o,
          u,
          s,
          c,
          f,
          l,
          d,
          v,
          p = nP(t),
          h = p.on,
          g = p.emit,
          $ = p.bind,
          m = p.unbind,
          _ = t.state,
          y = e.Move,
          b = e.Scroll,
          w = e.Controller,
          x = e.Elements.track,
          S = e.Media.reduce,
          P = e.Direction,
          C = P.resolve,
          k = P.orient,
          L = y.getPosition,
          A = y.exceededLimit,
          D = !1;
        function z() {
          var n,
            t = i.drag;
          (d = n = !t), (c = "free" === t);
        }
        function I(n) {
          if (((l = !1), !d)) {
            var t,
              e,
              o = G(n);
            (t = n.target),
              (e = i.noDrag),
              E(t, "." + nQ + ", ." + nK) ||
                (e && E(t, e)) ||
                (!o && n.button) ||
                (w.isBusy()
                  ? j(n, !0)
                  : ((v = o ? x : window),
                    (f = _.is([4, 5])),
                    (s = null),
                    $(v, tf, N, tg),
                    $(v, tl, M, tg),
                    y.cancel(),
                    b.cancel(),
                    O(n)));
          }
        }
        function N(n) {
          if ((_.is(6) || (_.set(6), g("drag")), n.cancelable)) {
            if (f) {
              y.translate(o + ((v = R(n)), v / (D && t.is(td) ? 5 : 1)));
              var e,
                r,
                u,
                s,
                c,
                d,
                v,
                p = X(n) > 200,
                h = D !== (D = A());
              (p || h) && O(n), (l = !0), g("dragging"), j(n);
            } else {
              (e = n),
                nt(R(e)) > nt(R(e, !0)) &&
                  ((f =
                    ((r = n),
                    (u = i.dragMinThreshold),
                    (s = a(u)),
                    (c = (s && u.mouse) || 0),
                    (d = (s ? u.touch : +u) || 10),
                    nt(R(r)) > (G(r) ? d : c))),
                  j(n));
            }
          }
        }
        function M(n) {
          var o, r, u, s, a;
          _.is(6) && (_.set(3), g("dragged")),
            f &&
              ((s =
                ((r = u =
                  (function n(e) {
                    if (t.is(tv) || !D) {
                      var i = X(e);
                      if (i && i < 200) return R(e) / i;
                    }
                    return 0;
                  })((o = n))),
                L() +
                  nr(r) *
                    J(
                      nt(r) * (i.flickPower || 600),
                      c ? 1 / 0 : e.Layout.listSize() * (i.flickMaxPages || 1)
                    ))),
              (a = i.rewind && i.rewindByDrag),
              S(!1),
              c
                ? w.scroll(s, 0, i.snap)
                : t.is(tp)
                ? w.go(0 > k(nr(u)) ? (a ? "<" : "-") : a ? ">" : "+")
                : t.is(td) && D && a
                ? w.go(A(!0) ? ">" : "<")
                : w.go(w.toDest(s), !0),
              S(!0),
              j(n)),
            m(v, tf, N),
            m(v, tl, M),
            (f = !1);
        }
        function T(n) {
          !d && l && j(n, !0);
        }
        function O(n) {
          (s = u), (u = n), (o = L());
        }
        function R(n, t) {
          return W(n, t) - W(F(n), t);
        }
        function X(n) {
          return H(n) - H(F(n));
        }
        function F(n) {
          return (u === n && s) || u;
        }
        function W(n, t) {
          return (G(n) ? n.changedTouches[0] : n)["page" + C(t ? "Y" : "X")];
        }
        function G(n) {
          return "undefined" != typeof TouchEvent && n instanceof TouchEvent;
        }
        function B() {
          return f;
        }
        function Y(n) {
          d = n;
        }
        return {
          mount: function n() {
            $(x, tf, r, tg),
              $(x, tl, r, tg),
              $(x, tc, I, tg),
              $(x, "click", T, { capture: !0 }),
              $(x, "dragstart", j),
              h([nf, ng], z);
          },
          disable: Y,
          isDragging: B,
        };
      },
      Keyboard: function n(t, e, i) {
        var r,
          u,
          s = nP(t),
          a = s.on,
          c = s.bind,
          f = s.unbind,
          l = t.root,
          d = e.Direction.resolve;
        function v() {
          var n = i.keyboard;
          n && c((r = "global" === n ? window : l), t_, $);
        }
        function p() {
          f(r, t_);
        }
        function h(n) {
          u = n;
        }
        function g() {
          var n = u;
          (u = !0),
            o(function () {
              u = n;
            });
        }
        function $(n) {
          if (!u) {
            var e = tm(n);
            e === d(n8) ? t.go("<") : e === d(nL) && t.go(">");
          }
        }
        return {
          mount: function n() {
            v(), a(ng, p), a(ng, v), a(nd, g);
          },
          destroy: p,
          disable: h,
        };
      },
      LazyLoad: function n(e, o, r) {
        var u = nP(e),
          s = u.on,
          a = u.off,
          c = u.bind,
          f = u.emit,
          l = "sequential" === r.lazyLoad,
          d = [nv, ny],
          v = [];
        function p() {
          t(v),
            o.Slides.forEach(function (n) {
              B(n.slide, tw).forEach(function (t) {
                var e = O(t, ty),
                  i = O(t, tb);
                if (e !== t.src || i !== t.srcset) {
                  var o = r.classes.spinner,
                    u = t.parentElement,
                    s = S(u, "." + o) || I("span", o, u);
                  v.push([t, n, s]), t.src || M(t, "none");
                }
              });
            }),
            l ? m() : (a(d), s(d, h), h());
        }
        function h() {
          (v = v.filter(function (n) {
            var t = r.perPage * ((r.preloadPages || 1) + 1) - 1;
            return !n[1].isWithin(e.index, t) || g(n);
          })).length || a(d);
        }
        function g(n) {
          var t = n[0];
          y(n[1].slide, tr),
            c(t, "load error", i($, n)),
            z(t, "src", O(t, ty)),
            z(t, "srcset", O(t, tb)),
            D(t, ty),
            D(t, tb);
        }
        function $(n, t) {
          var e = n[0],
            i = n[1];
          Y(i.slide, tr),
            "error" !== t.type && (F(n[2]), M(e, ""), f(nS, e, i), f(n$)),
            l && m();
        }
        function m() {
          v.length && g(v.shift());
        }
        return {
          mount: function n() {
            r.lazyLoad && (p(), s(nh, p));
          },
          destroy: i(t, v),
          check: h,
        };
      },
      Pagination: function n(o, r, u) {
        var s,
          a,
          c = nP(o),
          f = c.on,
          l = c.emit,
          d = c.bind,
          v = r.Slides,
          p = r.Elements,
          h = r.Controller,
          g = h.hasFocus,
          $ = h.getIndex,
          m = h.go,
          _ = r.Direction.resolve,
          b = p.pagination,
          w = [];
        function E() {
          x(), f([ng, nh, "ei"], E);
          var n = u.pagination;
          b && M(b, n ? "" : "none"),
            n &&
              (f([nd, n_, ny], L),
              (function n() {
                var t = o.length,
                  e = u.classes,
                  r = u.i18n,
                  c = u.perPage,
                  f = g() ? h.getEnd() + 1 : nn(t / c);
                (s = b || I("ul", e.pagination, p.track.parentElement)),
                  y(s, (a = nJ + "--" + C())),
                  z(s, nz, "tablist"),
                  z(s, n3, r.select),
                  z(s, nX, "ttb" === C() ? "vertical" : "");
                for (var l = 0; l < f; l++) {
                  var $ = I("li", null, s),
                    m = I("button", { class: e.page, type: "button" }, $),
                    _ = v.getIn(l).map(function (n) {
                      return n.slide.id;
                    }),
                    E = !g() && c > 1 ? r.pageX : r.slideX;
                  d(m, "click", i(S, l)),
                    u.paginationKeyboard && d(m, "keydown", i(P, l)),
                    z($, nz, "presentation"),
                    z(m, nz, "tab"),
                    z(m, nM, _.join(" ")),
                    z(m, n3, nu(E, l + 1)),
                    z(m, nI, -1),
                    w.push({ li: $, button: m, page: l });
                }
              })(),
              L(),
              l("pagination:mounted", { list: s, items: w }, k(o.index)));
        }
        function x() {
          s && (F(b ? e(s.children) : s), Y(s, a), t(w), (s = null)),
            c.destroy();
        }
        function S(n) {
          m(">" + n, !0);
        }
        function P(n, t) {
          var e = w.length,
            i = tm(t),
            o = C(),
            r = -1;
          i === _(nL, !1, o)
            ? (r = ++n % e)
            : i === _(n8, !1, o)
            ? (r = (--n + e) % e)
            : "Home" === i
            ? (r = 0)
            : "End" === i && (r = e - 1);
          var u = w[r];
          u && (T(u.button), m(">" + r), j(t, !0));
        }
        function C() {
          return u.paginationDirection || u.direction;
        }
        function k(n) {
          return w[h.toPage(n)];
        }
        function L() {
          var n = k($(!0)),
            t = k($());
          if (n) {
            var e = n.button;
            Y(e, tt), D(e, nO), z(e, nI, -1);
          }
          if (t) {
            var i = t.button;
            y(i, tt), z(i, nO, !0), z(i, nI, "");
          }
          l("pagination:updated", { list: s, items: w }, n, t);
        }
        return { items: w, mount: E, destroy: x, getAt: k, update: L };
      },
      Sync: function n(e, o, r) {
        var u = r.isNavigation,
          s = r.slideFocus,
          a = [];
        function c() {
          var n, t;
          e.splides.forEach(function (n) {
            n.isParent || (l(e, n.splide), l(n.splide, e));
          }),
            u &&
              ((n = nP(e)),
              (t = n.on),
              t(np, p),
              t("sk", h),
              t([nf, ng], v),
              a.push(n),
              n.emit(nw, e.splides));
        }
        function f() {
          a.forEach(function (n) {
            n.destroy();
          }),
            t(a);
        }
        function l(n, t) {
          var e = nP(n);
          e.on(nd, function (n, e, i) {
            t.go(t.is(tv) ? i : n);
          }),
            a.push(e);
        }
        function v() {
          z(o.Elements.list, nX, "ttb" === r.direction ? "vertical" : "");
        }
        function p(n) {
          e.go(n.index);
        }
        function h(n, t) {
          $(tE, tm(t)) && (p(n), j(t));
        }
        return {
          setup: i(o.Media.set, { slideFocus: d(s) ? u : s }, !0),
          mount: c,
          destroy: f,
          remount: function n() {
            f(), c();
          },
        };
      },
      Wheel: function n(t, e, i) {
        var o = nP(t).bind,
          r = 0;
        function u(n) {
          var o,
            u = i.wheelY ? n.deltaY : 0,
            s = i.wheelX ? -n.deltaX : 0,
            a = Math.abs(s) > Math.abs(u) ? s : u,
            c = a < 0,
            f = H(n),
            l = i.wheelMinThreshold || 0,
            d = i.wheelSleep || 0;
          nt(a) > l && f - r > d && (t.go(c ? "<" : ">"), (r = f)),
            ((i.hasOwnProperty("wheelY") && u) ||
              (i.hasOwnProperty("wheelX") && wheelX)) &&
              ((o = c),
              !i.releaseWheel ||
                t.state.is(4) ||
                -1 !== e.Controller.getAdjacent(o)) &&
              j(n);
        }
        return {
          mount: function n() {
            i.wheel && o(e.Elements.track, "wheel", u, tg);
          },
        };
      },
      Live: function n(t, e, o) {
        var r = nP(t).on,
          u = e.Elements.track,
          s = o.live && !o.isNavigation,
          a = I("span", tn),
          c = nC(90, i(f, !1));
        function f(n) {
          z(u, nF, n), n ? (b(u, a), c.start()) : (F(a), c.cancel());
        }
        function l(n) {
          s && z(u, n4, n ? "off" : "polite");
        }
        return {
          mount: function n() {
            s &&
              (l(!e.Autoplay.isPaused()),
              z(u, nW, !0),
              (a.textContent = "…"),
              r(nE, i(l, !0)),
              r(nx, i(l, !1)),
              r([nv, ny], i(f, !0)));
          },
          disable: l,
          destroy: function n() {
            D(u, [n4, nW, nF]), F(a);
          },
        };
      },
    }),
    tS = {
      type: "slide",
      role: "region",
      speed: 400,
      perPage: 1,
      cloneStatus: !0,
      arrows: !0,
      pagination: !0,
      paginationKeyboard: !0,
      interval: 5e3,
      pauseOnHover: !0,
      pauseOnFocus: !0,
      resetProgress: !0,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      drag: !0,
      direction: "ltr",
      trimSpace: !0,
      focusableNodes: "a, button, textarea, input, select, iframe",
      live: !0,
      classes: {
        slide: nH,
        clone: nU,
        arrows: nq,
        arrow: nK,
        prev: nV,
        next: n7,
        pagination: nJ,
        page: nQ,
        spinner: nG + "spinner",
      },
      i18n: {
        prev: "Previous slide",
        next: "Next slide",
        first: "Go to first slide",
        last: "Go to last slide",
        slideX: "Go to slide %s",
        pageX: "Go to page %s",
        play: "Start autoplay",
        pause: "Pause autoplay",
        carousel: "carousel",
        slide: "slide",
        select: "Select a slide to show",
        slideLabel: "%s of %s",
      },
      reducedMotion: { speed: 0, rewindSpeed: 0, autoplay: "pause" },
    };
  function tP(n, t, e) {
    var i = t.Slides;
    function u() {
      i.forEach(function (n) {
        n.style("transform", "translateX(-" + 100 * n.index + "%)");
      });
    }
    return {
      mount: function t() {
        nP(n).on([nf, nh], u);
      },
      start: function n(t, r) {
        i.style("transition", "opacity " + e.speed + "ms " + e.easing), o(r);
      },
      cancel: r,
    };
  }
  function tC(n, t, e) {
    var o,
      r = t.Move,
      u = t.Controller,
      s = t.Scroll,
      a = t.Elements.list,
      c = i(N, a, "transition");
    function f() {
      c(""), s.cancel();
    }
    return {
      mount: function t() {
        nP(n).bind(a, "transitionend", function (n) {
          n.target === a && o && (f(), o());
        });
      },
      start: function t(i, a) {
        var f = r.toPosition(i, !0),
          l = r.getPosition(),
          d = (function t(i) {
            var o = e.rewindSpeed;
            if (n.is(td) && o) {
              var r = u.getIndex(!0),
                s = u.getEnd();
              if ((0 === r && i >= s) || (r >= s && 0 === i)) return o;
            }
            return e.speed;
          })(i);
        nt(f - l) >= 1 && d >= 1
          ? e.useScroll
            ? s.scroll(f, d, !1, a)
            : (c("transform " + d + "ms " + e.easing),
              r.translate(f, !0),
              (o = a))
          : (r.jump(i), a());
      },
      cancel: f,
    };
  }
  var tk = (function () {
    function n(t, e) {
      (this.event = nP()),
        (this.Components = {}),
        (this.state = (function n(t) {
          var e = 1;
          function i(n) {
            e = n;
          }
          return {
            set: i,
            is: function n(t) {
              return $(h(t), e);
            },
          };
        })(1)),
        (this.splides = []),
        (this._o = {}),
        (this._E = {});
      var i = l(t) ? G(document, t) : t;
      V(i, i + " is invalid."),
        (this.root = i),
        (e = L(
          { label: O(i, n3) || "", labelledby: O(i, nR) || "" },
          tS,
          n.defaults,
          e || {}
        ));
      try {
        L(e, JSON.parse(O(i, K)));
      } catch (o) {
        V(!1, "Invalid JSON");
      }
      this._o = Object.create(L({}, e));
    }
    var i = n.prototype;
    return (
      (i.mount = function n(t, e) {
        var i = this,
          o = this.state,
          r = this.Components;
        V(o.is([1, 7]), "Already mounted!"),
          o.set(1),
          (this._C = r),
          (this._T = e || this._T || (this.is(tp) ? tP : tC)),
          (this._E = t || this._E);
        var u = k({}, tx, this._E, { Transition: this._T });
        return (
          C(u, function (n, t) {
            var e = n(i, r, i._o);
            (r[t] = e), e.setup && e.setup();
          }),
          C(r, function (n) {
            n.mount && n.mount();
          }),
          this.emit(nf),
          y(this.root, "is-initialized"),
          o.set(3),
          this.emit(nl),
          this
        );
      }),
      (i.sync = function n(t) {
        return (
          this.splides.push({ splide: t }),
          t.splides.push({ splide: this, isParent: !0 }),
          this.state.is(3) &&
            (this._C.Sync.remount(), t.Components.Sync.remount()),
          this
        );
      }),
      (i.go = function n(t) {
        return this._C.Controller.go(t), this;
      }),
      (i.on = function n(t, e) {
        return this.event.on(t, e), this;
      }),
      (i.off = function n(t) {
        return this.event.off(t), this;
      }),
      (i.emit = function n(t) {
        var i;
        return (
          (i = this.event).emit.apply(i, [t].concat(e(arguments, 1))), this
        );
      }),
      (i.add = function n(t, e) {
        return this._C.Slides.add(t, e), this;
      }),
      (i.remove = function n(t) {
        return this._C.Slides.remove(t), this;
      }),
      (i.is = function n(t) {
        return this._o.type === t;
      }),
      (i.refresh = function n() {
        return this.emit(nh), this;
      }),
      (i.destroy = function n(e) {
        void 0 === e && (e = !0);
        var i = this.event,
          o = this.state;
        return (
          o.is(1)
            ? nP(this).on(nl, this.destroy.bind(this, e))
            : (C(
                this._C,
                function (n) {
                  n.destroy && n.destroy(e);
                },
                !0
              ),
              i.emit(nb),
              i.destroy(),
              e && t(this.splides),
              o.set(7)),
          this
        );
      }),
      _createClass(n, [
        {
          key: "options",
          get: function n() {
            return this._o;
          },
          set: function n(t) {
            this._C.Media.set(t, !0, !0);
          },
        },
        {
          key: "length",
          get: function n() {
            return this._C.Slides.getLength(!0);
          },
        },
        {
          key: "index",
          get: function n() {
            return this._C.Controller.getIndex();
          },
        },
      ]),
      n
    );
  })();
  return (
    (tk.defaults = {}),
    (tk.STATES = {
      CREATED: 1,
      MOUNTED: 2,
      IDLE: 3,
      MOVING: 4,
      SCROLLING: 5,
      DRAGGING: 6,
      DESTROYED: 7,
    }),
    tk
  );
});
