import { defineStore } from 'pinia'

export const useUserprofile = defineStore('userprofile', {
    state: () => ({
      userprofile: {},
    }),
    actions: {
     async addToStore() {
      const supabase = useSupabaseClient();
      const user = useSupabaseUser();
      if (user?.value?.id) {
        const { data } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url,isadmin`)
        .eq("id", user.value.id)
        .single();
        this.userprofile = data
        
      }},
      clearProfile() {
        this.userprofile = {}
      }
      
    },
    getters: {
      getUser: (state) => state.userprofile,
      
     
    },
  })