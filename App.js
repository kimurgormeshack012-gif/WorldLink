import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Alert } from 'react-native';

const BLUE = '#287BFF';
const PURPLE = '#8B4DFF';
const NAVY = '#090E2D';

function Action({ title, onPress, secondary = false }) {
  return <TouchableOpacity onPress={onPress} style={[styles.button, secondary && styles.secondary]}><Text style={styles.buttonText}>{title}</Text></TouchableOpacity>;
}
function Field({ value, onChangeText, placeholder, secureTextEntry = false }) {
  return <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#8992B8" secureTextEntry={secureTextEntry} style={styles.input} />;
}

export default function App() {
  const [screen, setScreen] = useState('Welcome');
  const [tab, setTab] = useState('Home');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [caption, setCaption] = useState('');
  const [posts, setPosts] = useState([{ id: 1, author: 'Amina Kenya 🇰🇪', text: 'Greetings from Nairobi! Connect • Share • Belong. 🌍', likes: 12 }]);
  const [following, setFollowing] = useState([]);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [liked, setLiked] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [reports, setReports] = useState([]);

  const goTab = (next) => { setTab(next); setScreen('App'); };
  const addPost = () => { if (!caption.trim()) return; setPosts([{ id: Date.now(), author: name || 'WorldLink Member', text: caption.trim(), likes: 0 }, ...posts]); setCaption(''); setTab('Home'); };
  const follow = (person) => setFollowing(old => old.includes(person) ? old.filter(x => x !== person) : [...old, person]);
  const toggleLike = (id) => setLiked(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);
  const reportPost = (post) => Alert.alert('Report post', 'Choose the reason for reporting this post.', [
    { text: 'Bullying or harassment', onPress: () => saveReport(post, 'Bullying or harassment') },
    { text: 'Spam or scam', onPress: () => saveReport(post, 'Spam or scam') },
    { text: 'Inappropriate content', onPress: () => saveReport(post, 'Inappropriate content') },
    { text: 'Other concern', onPress: () => saveReport(post, 'Other concern') },
    { text: 'Cancel', style: 'cancel' }
  ]);
  const saveReport = (post, reason) => {
    setReports(old => [...old, { id: Date.now(), postId: post.id, author: post.author, reason }]);
    Alert.alert('Report saved in demo', 'Thank you. This report is only stored on this device while the demo is running; it has not been sent to a moderator.');
  };
  const blockUser = (person) => Alert.alert('Block account?', `You will hide ${person}'s demo posts and conversations on this screen.`, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Block', style: 'destructive', onPress: () => {
      setBlockedUsers(old => old.includes(person) ? old : [...old, person]);
      setFollowing(old => old.filter(x => x !== person));
    }}
  ]);
  const unblockUser = (person) => setBlockedUsers(old => old.filter(x => x !== person));

  const Header = () => <View style={styles.header}><Text style={styles.logo}>🌍 World<Text style={{color:'#B58AFF'}}>Link</Text></Text><Text style={styles.tagline}>CONNECT • SHARE • BELONG</Text></View>;
  const Nav = () => <View style={styles.nav}>{['Home','Discover','Create','Messages','Profile'].map((item) => <TouchableOpacity key={item} onPress={() => goTab(item)} style={[styles.navItem, tab === item && styles.navActive]}><Text style={styles.navText}>{item === 'Create' ? '＋' : item}</Text></TouchableOpacity>)}</View>;

  return <SafeAreaView style={styles.safe}><StatusBar barStyle="light-content" backgroundColor={NAVY}/><Header />
    {screen === 'Welcome' && <View style={styles.center}><Text style={styles.globe}>🌐</Text><Text style={styles.title}>Welcome to WorldLink</Text><Text style={styles.muted}>Connect with people across the world.</Text><Action title="Create account" onPress={() => setScreen('Register')}/><Action title="Log in" secondary onPress={() => setScreen('Login')}/><Text style={styles.note}>A social community concept built with a blue and purple identity.</Text></View>}
    {screen === 'Register' && <ScrollView contentContainerStyle={styles.content}><Text style={styles.title}>Create your account</Text><Field value={name} onChangeText={setName} placeholder="Full name or username"/><Field value={email} onChangeText={setEmail} placeholder="Email address"/><Field value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry/><Action title="Continue to demo" onPress={() => { if (name.trim() && email.trim() && password.trim()) { setScreen('App'); setTab('Home'); } }}/><Action title="Back" secondary onPress={() => setScreen('Welcome')}/><Text style={styles.note}>Demo only: this form does not create a real account or send your details anywhere.</Text></ScrollView>}
    {screen === 'Login' && <ScrollView contentContainerStyle={styles.content}><Text style={styles.title}>Log in</Text><Field value={email} onChangeText={setEmail} placeholder="Email or phone number"/><Field value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry/><Action title="Log in to demo" onPress={() => { if (email.trim() && password.trim()) { setScreen('App'); setTab('Home'); } }}/><Action title="Back" secondary onPress={() => setScreen('Welcome')}/><Text style={styles.note}>Demo only: authentication is not connected yet.</Text></ScrollView>}
    {screen === 'App' && <><ScrollView contentContainerStyle={styles.content}>
      {tab === 'Home' && <><Text style={styles.title}>Your Feed</Text><Text style={styles.muted}>Updates from your WorldLink community</Text><View style={styles.storyRow}>{['Your story','Sarah 🇰🇪','David 🇺🇬','Maria 🇧🇷'].map(x => <View style={styles.story} key={x}><Text style={styles.storyEmoji}>✨</Text><Text style={styles.small}>{x}</Text></View>)}</View>{posts.filter(p => !blockedUsers.includes(p.author)).map(p => <View style={styles.card} key={p.id}><Text style={styles.cardTitle}>{p.author}</Text><Text style={styles.postText}>{p.text}</Text><TouchableOpacity onPress={() => toggleLike(p.id)}><Text style={styles.link}>{liked.includes(p.id) ? '♥ Liked' : '♡ Like'}  ·  Comment  ·  Share</Text></TouchableOpacity><View style={styles.safetyRow}><TouchableOpacity onPress={() => reportPost(p)}><Text style={styles.safetyLink}>Report</Text></TouchableOpacity><TouchableOpacity onPress={() => blockUser(p.author)}><Text style={styles.safetyLink}>Block author</Text></TouchableOpacity></View></View>)}</>}
      {tab === 'Discover' && <><Text style={styles.title}>Discover people</Text>{['Sarah Wanjiku 🇰🇪','James Mwangi 🇰🇪','Maria Lopez 🇧🇷','David Ochieng 🇺🇬'].filter(p => !blockedUsers.includes(p)).map(p => <View style={styles.person} key={p}><Text style={styles.cardTitle}>{p}</Text><View><Action title={following.includes(p) ? 'Following' : 'Follow'} onPress={() => follow(p)}/><TouchableOpacity onPress={() => blockUser(p)}><Text style={styles.safetyLink}>Block</Text></TouchableOpacity></View></View>)}<Text style={styles.section}>Explore communities</Text><Text style={styles.muted}>Travel  ·  Technology  ·  Music  ·  Learning</Text></>}
      {tab === 'Create' && <><Text style={styles.title}>Create a Feed</Text><TextInput value={caption} onChangeText={setCaption} placeholder="What's happening in your world?" placeholderTextColor="#8992B8" multiline style={[styles.input, styles.multiline]}/><Action title="Share demo post" onPress={addPost}/><Text style={styles.note}>Posts are stored only in this running demo and disappear when it resets.</Text></>}
      {tab === 'Messages' && <><Text style={styles.title}>Messages</Text><View style={styles.card}><Text style={styles.cardTitle}>Message requests</Text><Text style={styles.muted}>Only followers and approved users can message you.</Text></View>{['James Mwangi','Sarah Wanjiku','David Ochieng'].filter(p => !blockedUsers.includes(p)).map(p => <View style={styles.person} key={p}><Text style={styles.cardTitle}>{p}</Text><Text style={styles.small}>Demo conversation preview</Text></View>)}</>}
      {tab === 'Profile' && <><Text style={styles.title}>{name || 'WorldLink Member'}</Text><Text style={styles.muted}>Connect • Share • Belong 🌍</Text><View style={styles.stats}><Text style={styles.stat}>0  Feeds</Text><Text style={styles.stat}>{following.length} Following</Text><Text style={styles.stat}>0  Followers</Text></View><TouchableOpacity onPress={() => setPrivateAccount(!privateAccount)} style={styles.card}><Text style={styles.cardTitle}>Account privacy: {privateAccount ? 'Private' : 'Public'}</Text><Text style={styles.muted}>Tap to switch demo setting</Text></TouchableOpacity><Text style={styles.section}>Blocked accounts ({blockedUsers.length})</Text>{blockedUsers.length === 0 ? <Text style={styles.small}>No accounts blocked in this demo.</Text> : blockedUsers.map(person => <View style={styles.person} key={person}><Text style={styles.cardTitle}>{person}</Text><TouchableOpacity onPress={() => unblockUser(person)}><Text style={styles.safetyLink}>Unblock</Text></TouchableOpacity></View>)}<Text style={styles.section}>Reports made ({reports.length})</Text><Text style={styles.small}>Reports are only saved locally in this demo and are not sent to a moderation team.</Text><Action title="Log out" secondary onPress={() => setScreen('Welcome')}/></>}
    </ScrollView><Nav /></>}
  </SafeAreaView>;
}

const styles = StyleSheet.create({ safe:{flex:1,backgroundColor:NAVY}, header:{paddingHorizontal:20,paddingTop:12,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#28315F'}, logo:{fontSize:27,fontWeight:'800',color:'#FFFFFF'}, tagline:{fontSize:10,letterSpacing:2,color:'#AEBBEE',marginTop:3}, content:{padding:18,paddingBottom:30}, center:{flex:1,justifyContent:'center',alignItems:'center',padding:24}, globe:{fontSize:72,marginBottom:18}, title:{fontSize:25,fontWeight:'800',color:'#FFFFFF',marginBottom:12}, muted:{color:'#B9C4E9',fontSize:14,lineHeight:21,marginBottom:14}, button:{backgroundColor:BLUE,padding:15,borderRadius:13,alignItems:'center',marginTop:12}, secondary:{backgroundColor:'#292F60',borderWidth:1,borderColor:'#555F9D'},buttonText:{color:'#FFFFFF',fontWeight:'700',fontSize:15},input:{backgroundColor:'#171E49',borderWidth:1,borderColor:'#354174',borderRadius:12,padding:14,color:'#FFFFFF',fontSize:15,marginBottom:12},note:{color:'#8F9BC5',fontSize:12,lineHeight:18,marginTop:16,textAlign:'center'},storyRow:{flexDirection:'row',justifyContent:'space-between',marginVertical:18},story:{alignItems:'center',backgroundColor:'#1A2253',borderRadius:14,padding:10,minWidth:72},storyEmoji:{fontSize:24,marginBottom:5},small:{fontSize:11,color:'#B9C4E9'},card:{backgroundColor:'#171E49',borderRadius:15,padding:16,marginBottom:14,borderWidth:1,borderColor:'#2C376C'},cardTitle:{fontSize:16,fontWeight:'700',color:'#FFFFFF',marginBottom:8},postText:{fontSize:15,color:'#E4E9FF',lineHeight:22,marginBottom:14},link:{color:'#B58AFF',fontWeight:'700'},safetyRow:{flexDirection:'row',gap:24,marginTop:14},safetyLink:{color:'#C3A5FF',fontSize:12,fontWeight:'700',paddingVertical:5},person:{backgroundColor:'#171E49',padding:13,borderRadius:13,marginBottom:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},section:{fontSize:18,fontWeight:'700',color:'#FFFFFF',marginTop:18,marginBottom:10},multiline:{minHeight:130,textAlignVertical:'top'},stats:{flexDirection:'row',justifyContent:'space-between',marginVertical:18},stat:{color:'#FFFFFF',fontWeight:'700',fontSize:13},nav:{flexDirection:'row',backgroundColor:'#11183F',paddingVertical:9,paddingHorizontal:5,borderTopWidth:1,borderTopColor:'#303A70'},navItem:{flex:1,paddingVertical:11,alignItems:'center',borderRadius:10},navActive:{backgroundColor:'#3A2A83'},navText:{color:'#FFFFFF',fontSize:11,fontWeight:'700'}});
