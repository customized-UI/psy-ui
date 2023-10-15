import { defineStore } from "pinia";
import { store } from "@/store";

export const useCopilots: any = defineStore("copilots-store", {
  state: () => ({
    isSearchHistroy: false,
    authorList: {
      'floyd':{
        id: 1,
        title: "弗洛伊德",
        value: "floyd",
        src: '/src/assets/images/floyd.png',
        data: {
          url: "/corapi/sdk/p/7696eb26feb3d1e86ff2/a/37c16dc1049b4b082737/r",
          headers: {
            'Authorization': "",
            "Content-Type": "application/json",
          },
          data: {
            version: 'latest',
            config: {"OUTPUT_STREAM":{"provider_id":"openai","model_id":"gpt-3.5-turbo-16k","use_cache":false,}},
            blocking: false,
            stream: true,
            inputs: [],
          },
        }
      },
      'adler':{
        id: 2,
        title: "阿德勒",
        value: "adler",
        src: '/src/assets/images/adler.png',
        data: {
          url: "/corapi/sdk/p/7696eb26feb3d1e86ff2/a/12059b3f0d44ae933a26/r",
          headers: {
            'Authorization': "",
            "Content-Type": "application/json",
          },
          data: {
            version: 'latest',
            config: {"OUTPUT_STREAM":{"provider_id":"openai","model_id":"gpt-3.5-turbo-16k","use_cache":false}},
            blocking: false,
            stream: true,
            inputs: [],
          },
        }
      },
      'jung':{
        id: 3,
        title: "荣格",
        value: "jung",
        src: '/src/assets/images/jung.png',
        data: {
          url: "/corapi/sdk/p/7696eb26feb3d1e86ff2/a/3cfb2867090e274a731f/r",
          headers: {
            'Authorization': "",
            "Content-Type": "application/json",
          },
          data: {
            version: 'latest',
            config: {"OUTPUT_STREAM":{"provider_id":"openai","model_id":"gpt-3.5-turbo-16k","use_cache":false}},
            blocking: false,
            stream: true,
            inputs: [],
          },
        }
      },
      'yalom':{
        id: 4,
        title: "欧文亚隆",
        value: "yalom",
        src: '/src/assets/images/yalom.png',
        data: {
          url: "/corapi/sdk/p/7696eb26feb3d1e86ff2/a/7640a52ef1f441e61bdd/r",
          headers: {
            'Authorization': "",
            "Content-Type": "application/json",
          },
          data: {
            version: 'latest',
            config: {"OUTPUT_STREAM":{"provider_id":"openai","model_id":"gpt-3.5-turbo-16k","use_cache":false}},
            blocking: false,
            stream: true,
            inputs: [],
          },
        }
      },
      'klein':{
        id: 5,
        title: "克莱因",
        value: "klein",
        src: '/src/assets/images/klein.png',
        data: {
          url: "/corapi/sdk/p/7696eb26feb3d1e86ff2/a/38206dd1d58703d96bc1/r",
          headers: {
            'Authorization': "",
            "Content-Type": "application/json",
          },
          data: {
            version: 'latest',
            config: {"OUTPUT_STREAM":{"provider_id":"openai","model_id":"gpt-3.5-turbo-16k","use_cache":false}},
            blocking: false,
            stream: true,
            inputs: [],
          },
        }
      },
      'rogers':{
        id: 6,
        title: "罗杰斯",
        value: "rogers",
        src: '/src/assets/images/rogers.png',
        data: {
          url: "/corapi/sdk/p/7696eb26feb3d1e86ff2/a/f8efd7d002905cb412be/r",
          headers: {
            'Authorization': "",
            "Content-Type": "application/json",
          },
          data: {
            version: 'latest',
            config: {"OUTPUT_STREAM":{"provider_id":"openai","model_id":"gpt-3.5-turbo-16k","use_cache":false}},
            blocking: false,
            stream: true,
            inputs: [],
          },
        }
      },
    },
    copilotsObj: {
      first: {
        url: "/tryapi/sdk/p/247598f48799e1e33154/a/1611fbd1cbca86423d46/r",
        headers: {
          'Authorization': "Bearer sk-bec0a083adfd550b94bc03af07dd623a",
          "Content-Type": "application/json",
        },
        data: {
          version: 'latest',
          config: {
            MODEL_1: {
              provider_id: "openai",
              model_id: "gpt-3.5-turbo",
              use_cache: true,
              use_semantic_cache: false,
            },
            OUTPUT_STREAM: {
              provider_id: "openai",
              model_id: "gpt-4",
              use_cache: true,
              use_semantic_cache: false,
            },
          },
          blocking: true,
          inputs: [],
        },
      },
      Charge: {
        url: "/corapi/sdk/p/7696eb26feb3d1e86ff2/a/59e76975b652ea0dbc56/r",
        headers: {
          'Authorization': "",
          "Content-Type": "application/json",
        },
        data: {
          version: 'latest',
          config: { "OUTPUT_STREAM": { "provider_id": "openai", "model_id": "gpt-3.5-turbo-0613", "use_cache": false, "use_semantic_cache": false } },
          blocking: false,
          stream: true,
          inputs: [],
        },
      },
      Learn: {
        url: "/corapi/sdk/p/7696eb26feb3d1e86ff2/a/4d0879d59886d89b6268/r",
        headers: {
          'Authorization': "",
          "Content-Type": "application/json",
        },  
        data: {
          version: 'latest',
          config: { "OUTPUT_STREAM": { "provider_id": "openai", "model_id": "gpt-3.5-turbo-16k", "use_cache": false } },
          blocking: false,
          stream: true,
          inputs: [],
        },
      },
      Plan: {
        url: "/corapi/sdk/p/7696eb26feb3d1e86ff2/a/97fd6d38f5523997ba41/r",
        headers: {
          'Authorization': "",
          "Content-Type": "application/json",
        },
        data: {
          version: 'latest',
          config: {"OUTPUT_STREAM":{"provider_id":"openai","model_id":"gpt-4","use_cache":false,"use_semantic_cache":false}},
          blocking: false,
          stream: true,
          inputs: [],
        },
      },
      Video: {
        url: "/corapi/sdk/p/7696eb26feb3d1e86ff2/a/679c0981b3640e277d06/r",
        headers: {
          'Authorization': "",
          "Content-Type": "application/json",
        },
        data: {
          version: 'latest',
          config: {"GET_CC":{"use_cache":true},"GET_CID":{"use_cache":false},"GET_URL":{"use_cache":true},"GET_BV":{"provider_id":"openai","model_id":"gpt-3.5-turbo","use_cache":false,"use_semantic_cache":false},"OUTPUT_STREAM":{"provider_id":"openai","model_id":"gpt-3.5-turbo-16k-0613","use_cache":false,"use_semantic_cache":false}},
          blocking: false,
          stream: true,
          inputs: [],
        },
      },
      Search: {
        url: "/corapi/sdk/p/7696eb26feb3d1e86ff2/a/0434753ec85a028ab264/r",
        headers: {
          'Authorization': "",
          "Content-Type": "application/json",
        },
        data: {
          version: 'latest',
          config: {"RETRIEVALS":{"knowledge":[{"project_id":"7696eb26feb3d1e86ff2","data_source_id":"psy"}],"top_k":10,"filter":{"tags":null,"timestamp":null},"use_cache":false},"OUTPUT_STREAM":{"provider_id":"openai","model_id":"gpt-3.5-turbo-16k-0613","use_cache":true}},
          blocking: false,
          stream: true,
          inputs: [],
        },
      }
    },
    CLP_CONFIG: {
      'Charge': {
        typeCN: '帮你拆书',
        role: '作者',
        title: '书名',
        grade: '',
        des: '输入书名、作者名，一键总结',
        showRole: true,
        showTitle: true,
        titleIsAreaText: false,
        showGrade: false,
        src:'/src/assets/images/charge.png'
      },
      'Learn': {
        typeCN: '英语学习',
        role: '作者',
        title: '主题',
        grade: '英语水平',
        des: '输入主题、等级，一键生成英语阅读训练',
        showRole: false,
        showTitle: true,
        titleIsAreaText: true,
        showGrade: true,
        src:'/src/assets/images/learn.png'
      },
      'Plan': {
        typeCN: '制定学习计划',
        role: '指导',
        title: '内容',
        grade: '等级',
        des: '输入导师、主题、等级，一键生成学习计划',
        showRole: true,
        showTitle: true,
        titleIsAreaText: true,
        showGrade: true,
        src:'/src/assets/images/plan.png'
      },
      'Video': {
        typeCN: 'B站视频总结',
        role: '指导',
        title: '视频BV号',
        grade: '等级',
        des: '输入BV号，一键总结视频',
        showRole: false,
        showTitle: true,
        titleIsAreaText: false,
        showGrade: false,
        src:'/src/assets/images/video.png'
      }
    }
  }),
});
