<template>
    <v-card height="130" flat class="overview-card" :color="color">
        <!-- <v-card-text>
            <div class="text-left">
                <p class="grey--textd font-weight-light mb-5" v-text="info.title" />
                <h3 class="headline font-weight text--primary">
                    {{ info.value }}
                </h3>
            </div>
        </v-card-text> -->
    </v-card>
</template>
<script>
import gql from 'graphql-tag'
export default {
    props:{
        color:{
            type:String,
            default(){
                return 'primary'
            }
        }
    },
    apollo: {
        // Subscriptions
        $subscribe: {
            // When a tag is added
            data: {
                query(){
                    return gql`subscription{
                        users_aggregate{
                            aggregate{
                                count
                            }
                        }
                    }`
                },
                
                // Result hook
                // Don't forget to destructure `data`
                result ({ data }) {
                    console.log(data)
                },
            },
        },
    },
}
</script>