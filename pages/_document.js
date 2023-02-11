import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="id">
        <Head>
          <script
            async
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GMAP}&libraries=places&callback=Function.prototype`}></script>
          <script
            async
            src={`https://www.googleoptimize.com/optimize.js?id=${process.env.GOOGLE_OPT}`}></script>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_ID}`} />
          <script
            async
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push({event: 'optimize.activate'});}
            gtag('js', new Date());
            gtag('config', '${process.env.GA_ID}', {
              page_path: window.location.pathname,
            });
          `
            }}
          />
          <script
            defer
            dangerouslySetInnerHTML={{
              __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.FB_PIXEL}');
              fbq('track', 'PageView');
              `
            }}
          />
          <script
            defer
            dangerouslySetInnerHTML={{
              __html: `
              (function(b,r,a,n,c,h,_,s,d,k){if(!b[n]||!b[n]._q){for(;s<_.length;)c(h,_[s++]);d=r.createElement(a);d.async=1;d.src="https://cdn.branch.io/branch-latest.min.js";k=r.getElementsByTagName(a)[0];k.parentNode.insertBefore(d,k);b[n]=h}})(window,document,"script","branch",function(b,r){b[r]=function(){b._q.push([r,arguments])}},{_q:[],_v:1},"addListener applyCode autoAppIndex banner closeBanner closeJourney creditHistory credits data deepview deepviewCta first getCode init link logout redeem referrals removeListener sendSMS setBranchViewData setIdentity track validateCode trackCommerceEvent logEvent disableTracking qrCode".split(" "), 0);

              branch.init('${process.env.BRANCH_SDK}');
              `
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function(i,s,o,g,r,a,m,n){i.moengage_object=r;t={};q=function(f){return function(){(i.moengage_q=i.moengage_q||[]).push({f:f,a:arguments})}};f=['track_event','add_user_attribute','add_first_name','add_last_name','add_email','add_mobile','add_user_name','add_gender','add_birthday','destroy_session','add_unique_user_id','moe_events','call_web_push','track','location_type_attribute'],h={onsite:["getData","registerCallback"]};for(k
                in f){t[f[k]]=q(f[k])}for(k in h)for(l in h[k]){null==t[k]&&(t[k]={}),t[k][h[k][l]]=q(k+"."+h[k][l])}a=s.createElement(o);m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);i.moe=i.moe||function(){n=arguments[0];return t};a.onload=function(){if(n){i[r]=moe(n)}}})(window,document,'script','https://cdn.moengage.com/webpush/moe_webSdk.min.latest.js','Moengage')

              Moengage = moe({
              app_id:"${process.env.MOENGAGE_APP_ID}",
              debug_logs: ${process.env.MOENGAGE_DEBUG_LOGS},
              cluster: "DC_4"
              });
              `
            }}
          />
        </Head>
        <body>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${process.env.FB_PIXEL}&ev=PageView&noscript=1`}
            />
          </noscript>
          <Main />
          <NextScript />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                function initFreshChat() {
                  window.fcWidget.init({
                    token: '${process.env.FRESHCHAT_TOKEN}',
                    host: '${process.env.FRESHCHAT_HOST}',
                    locale : "id",
                    config: {
                      headerProperty: {
                        hideChatButton: true
                      },
                      "cssNames": {
                        "widget": "custom_fc_frame"
                     }
                    }
                  });
                  window.fcWidget.on("widget:opened", function(resp) {
                    var floatingButton = document.getElementById('custom_chat_button')
                    if (floatingButton) {
                      floatingButton.style.visibility = "hidden"
                    }
                  });
                  window.fcWidget.on("widget:closed", function(resp) {
                    var floatingButton = document.getElementById('custom_chat_button')
                    if (floatingButton) {
                      floatingButton.style.visibility = "visible"
                    }
                  });
                }
                function initialize(i,t){var e;i.getElementById(t)?initFreshChat():((e=i.createElement("script")).id=t,e.async=!0,e.src="https://wchat.au.freshchat.com/js/widget.js",e.onload=initFreshChat,i.head.appendChild(e))}function initiateCall(){initialize(document,"Freshdesk Messaging-js-sdk")}window.addEventListener?window.addEventListener("load",initiateCall,!1):window.attachEvent("load",initiateCall,!1);
            `
            }}
          />
        </body>
      </Html>
    );
  }
}
