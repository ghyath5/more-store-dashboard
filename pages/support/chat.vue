<template>
    <v-container
          class="fill-height pa-0 "
        >
          <v-row class="no-gutters elevation-4">
            <v-col
              cols="12" sm="3"
              class="flex-grow-1 flex-shrink-0"
              style="border-right: 1px solid #0000001f;"
            >
              <v-responsive
                class="overflow-y-auto fill-height"
                height="750"
              >
                <v-list subheader :key="chats.all.length">
                  <v-list-item-group >
                    <template v-for="(item, index) in chats.all">
                      <v-list-item
                        :key="`parent${index}`"
                        :value="item.id"
                      >
                        <v-list-item-avatar color="grey lighten-1 white--text">
                          <v-icon>
                            chat_bubble
                          </v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title v-text="item.client_name" />
                          <v-list-item-subtitle v-text="'hi'" />
                        </v-list-item-content>
                        <v-list-item-icon>
                          <v-icon :color="item.active ? 'deep-purple accent-4' : 'grey'">
                            chat_bubble
                          </v-icon>
                        </v-list-item-icon>
                      </v-list-item>
                      <v-divider
                        :key="`chatDivider${index}`"
                        class="my-0"
                      />
                    </template>
                  </v-list-item-group>
                </v-list>
              </v-responsive>
            </v-col>
            <v-col
              cols="auto"
              class="flex-grow-1 flex-shrink-0"
            >
              <v-responsive
                class="overflow-y-hidden fill-height"
                height="750"
              >
                <v-card
                  flat
                  class="d-flex flex-column fill-height"
                >
                  <v-card-title>
                    john doe
                  </v-card-title>
                  <v-card-text class="flex-grow-1 overflow-y-auto">
                    <template v-for="(msg, i) in messages">
                      <div
                        :key="i"
                        :class="{ 'd-flex flex-row-reverse': msg.me }"
                      >
                        <v-menu offset-y>
                          <template v-slot:activator="{ on }">
                            <!-- <v-hover
                              v-slot:default="{ hover }"
                            > -->
                              <v-chip
                                :color="msg.me ? 'secondary' : 'info'"
                                dark
                                style="height:auto;white-space: normal;"
                                class="pa-4 mb-2"
                                v-on="on"
                              >
                                {{ msg.content }}
                                <!-- <sub
                                  class="ml-2"
                                  style="font-size: 0.5rem;"
                                >{{ msg.created_at }}</sub>
                                <v-icon
                                  v-if="hover"
                                  small
                                >
                                  expand_more
                                </v-icon> -->
                              </v-chip>
                            <!-- </v-hover> -->
                          </template>
                          <!-- <v-list>
                            <v-list-item>
                              <v-list-item-title>delete</v-list-item-title>
                            </v-list-item>
                          </v-list> -->
                        </v-menu>
                      </div>
                    </template>
                  </v-card-text>
                  <v-card-text class="flex-shrink-1">
                      <v-text-field
                      v-model="messageForm.content"
                      label="type_a_message"
                      type="text"
                      no-details
                      outlined
                      append-outer-icon="send"
                      @keyup.enter="sendMessage"
                      @click:append-outer="sendMessage"
                      hide-details
                    />
                  </v-card-text>
                </v-card>
              </v-responsive>
            </v-col>
          </v-row>
        </v-container>
</template>
<script>
import chatsGql from '~/gql/support/chatsMessages.gql'
import subscriptionGql from '~/gql/support/chatsSubscription.gql'
export default {
  data(){
      return {
          dataSub:false,
          chats:{all:[]},
          messages: [],
          messageForm: {
              content: "",
              me: true,
              created_at: "11:11am"
          }
      }
  },
  computed:{
    variables(){
      return {
        where: {
          supporter_id:{_is_null:true}
        },
        order_by: {
          created_at: 'desc',
        },
      }
    }
  },
  apollo: {
		chats: {
      query: chatsGql,
      fetchPolicy:'network-only',
			variables(){
        return this.variables
      },
      update(data){
        return {
          all:data.support_chat,
          count:data.support_chat_aggregate.aggregate.count
        }
        console.log("updated")
      },
      result({data}) {
				if (!this.dataSub) {
					this.subscribeToMore();
        }
			},
			error(error) {
				console.error("We've got an error!", error);
			},
			loadingKey: 'loading',
		}
	},
  methods:{
    sendMessage(){
        this.messages.push({...this.messageForm})
        this.messageForm.content = ""
    },
    subscribeToMore() {
      if (this.dataSub) {
        this.dataSub.unsubscribe();
      }
      this.dataSub = this.$apollo.queries.chats.subscribeToMore({
        document: subscriptionGql,
        fetchPolicy:'network-only',
        variables:this.variables,
        updateQuery: (previousResult, { subscriptionData: { data } }) => {
					if (!data.support_chat) return;
          this.chats.all = data.support_chat
          console.log(previousResult,this.chats.all);
				},
      });
    },
  }
}
</script>