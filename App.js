
import React, { useState } from 'react';
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, StatusBar, Alert,
  KeyboardAvoidingView, Platform
} from 'react-native';

const C = {
  bg: '#080D20',
  surface: '#111A33',
  card: '#151F3B',
  border: '#263453',
  blue: '#3987FF',
  purple: '#9565FF',
  white: '#FFFFFF',
  muted: '#9BAAC8',
  green: '#43D6A0',
  pink: '#FF6D9B'
};

function Button({ title, onPress, secondary = false }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[s.button, secondary && s.secondary]}
    >
      <Text style={s.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const Avatar({ name = 'W', size = 48, online = false }) {
  return (
    <View style={[
      s.avatar,
      { width: size, height: size, borderRadius: size / 2 }
    ]}>
      <Text style={{ color: C.white, fontSize: size * 0.38, fontWeight: '900' }}>
        {name.charAt(0).toUpperCase()}
      </Text>
      {online && <View style={s.online} />}
    </View>
  );
}


const BADGE_COLORS = {
  member: '#38BDF8',
  founder: '#F5B942',
  verified: '#22C55E',
  creator: '#A78BFA',
};

function Badge({ title, variant = 'verified' }) {
  const color = BADGE_COLORS[variant] || BADGE_COLORS.verified;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: color + '18',
        borderColor: color + '80',
        borderWidth: 1,
        borderRadius: 30,
        paddingHorizontal: 11,
        paddingVertical: 6,
        marginRight: 7,
        marginTop: 6,
      }}
    >
      <Text
        style={{
          color: color,
          fontSize: 11,
          fontWeight: '900',
          letterSpacing: 0.6,
        }}
      >
        {variant === 'verified' ? '✓' :
         variant === 'founder' ? '♛' :
         variant === 'creator' ? '★' : '✦'} {title}
      </Text>
    </View>
  );
}


function Label({ children }) {
  return <Text style={s.label}>{children}</Text>;
}

export default function App() {
  const [screen, setScreen] = useState('Welcome');
  const [tab, setTab] = useState('Home');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [caption, setCaption] = useState('');
  const [search, setSearch] = useState('');
  const [liked, setLiked] = useState([]);
  const [following, setFollowing] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const [privateAccount, setPrivateAccount] = useState(false);

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Amina Kenya',
      handle: '@amina',
      text: 'Greetings from Nairobi! 🌍 The world becomes smaller when we connect with amazing people.',
      likes: 128,
      comments: 24,
      time: '2 hours ago',
      verified: true
    },
    {
      id: 2,
      author: 'David Ochieng',
      handle: '@david',
      text: 'New adventures, new connections and new opportunities. That is what community is all about! ✨',
      likes: 86,
      comments: 12,
      time: '4 hours ago',
      verified: false
    }
  ]);

  const people = [
    'Sarah Wanjiku',
    'James Mwangi',
    'Maria Lopez',
    'David Ochieng',
    'Amina Kenya'
  ];

  const goTab = (value) => {
    setTab(value);
    setScreen('App');
  };

  const toggleLike = (id) => {
    setLiked(old =>
      old.includes(id)
        ? old.filter(x => x !== id)
        : [...old, id]
    );
  };

  const addPost = () => {
    if (!caption.trim()) {
      Alert.alert('Empty post', 'Write something before sharing.');
      return;
    }

    setPosts(old => [{
      id: Date.now(),
      author: name || 'WorldLink Member',
      handle: '@member',
      text: caption.trim(),
      likes: 0,
      comments: 0,
      time: 'Just now',
      verified: false
    }, ...old]);

    setCaption('');
    setTab('Home');
  };

  const toggleFollow = (person) => {
    setFollowing(old =>
      old.includes(person)
        ? old.filter(x => x !== person)
        : [...old, person]
    );
  };


const register = () => {
  if (!name.trim() || !email.trim() || !password.trim()) {
    Alert.alert(
      'Missing details',
      'Please fill in all required fields.'
    );
    return;
  }

  if (!email.includes('@') || password.length < 6) {
    Alert.alert(
      'Check your details',
      'Enter a valid email address and a password with at least 6 characters.'
    );
    return;
  }

  setScreen('App');
  setTab('Home');
};


  const Header = () => (
    <View style={s.header}>
      <View style={s.brand}>
        <View style={s.brandIcon}>
          <Text style={{ fontSize: 22 }}>🌐</Text>
        </View>
        <View>
          <Text style={s.logo}>
            World<Text style={{ color: C.purple }}>Link</Text>
          </Text>
          <Text style={s.tagline}>CONNECT BEYOND BORDERS</Text>
        </View>
      </View>

      {screen === 'App' && (
        <TouchableOpacity
          style={s.headerAction}
          onPress={() => goTab('Notifications')}
        >
          <Text style={s.headerActionText}>♢</Text>
          <View style={s.notificationDot} />
        </TouchableOpacity>
      )}
    </View>
  );

  const Nav = () => {
    const items = [
      ['Home', '⌂'],
      ['Explore', '⌕'],
      ['Create', '＋'],
      ['Messages', '✉'],
      ['Profile', '◉']
    ];

<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
  <Badge title="VERIFIED" variant="verified" />
  <Badge title="FOUNDER" variant="founder" />
  <Badge title="CREATOR" variant="creator" />
  <Badge title="MEMBER" variant="member" />
</View>

    return (
      <View style={s.nav}>
        {items.map(([label, icon]) => (
          <TouchableOpacity
            key={label}
            onPress={() => goTab(label)}
            style={s.navItem}
          >
            <View style={[s.navIconWrap, tab === label && s.navActive]}>
              <Text style={[
                s.navIcon,
                tab === label && { color: C.white }
              ]}>{icon}</Text>
            </View>
            <Text style={[
              s.navText,
              tab === label && { color: C.white }
            ]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const PostCard = ({ post }) => {
    const isLiked = liked.includes(post.id);

    return (
      <View style={s.postCard}>
        <View style={s.postHeader}>
          <Avatar name={post.author} size={46} online />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={s.postAuthor}>{post.author}</Text>
              {post.verified && <Text style={s.verified}> ✓</Text>}
            </View>
            <Text style={s.handle}>{post.handle} · {post.time}</Text>
          </View>
          <TouchableOpacity
            onPress={() => Alert.alert('Post options', 'Choose an action.', [
              { text: 'Report', onPress: () => Alert.alert('Report saved', 'Demo report recorded locally.') },
              { text: 'Block author', onPress: () => setBlocked(old => [...new Set([...old, post.author])]) },
              { text: 'Cancel', style: 'cancel' }
            ])}
          >
            <Text style={s.more}>•••</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.postText}>{post.text}</Text>

        <View style={s.postFooter}>
          <TouchableOpacity onPress={() => toggleLike(post.id)}>
            <Text style={[s.postAction, isLiked && { color: C.pink }]}>
              {isLiked ? '♥' : '♡'} {post.likes + (isLiked ? 1 : 0)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert('Comments', 'The comment system will be connected in a future update.')}
          >
            <Text style={s.postAction}>▢ {post.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert('Share', 'Post sharing will be connected in a future update.')}
          >
            <Text style={s.postAction}>↗ Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert('Saved', 'Save feature coming soon.')}
          >
            <Text style={s.postAction}>♧</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const Stories = () => (
    <View>
      <View style={s.sectionRow}>
        <Label>STORIES</Label>
        <Text style={s.mutedSmall}>See all →</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity style={s.story}>
          <View style={s.storyAdd}>
            <Avatar name={name || 'You'} size={54} />
            <View style={s.plusBadge}><Text style={s.plusText}>+</Text></View>
          </View>
          <Text style={s.storyName}>Your story</Text>
        </TouchableOpacity>

        {['Sarah', 'David', 'Maria', 'James', 'Amina'].map(person => (
          <TouchableOpacity
            key={person}
            style={s.story}
            onPress={() => Alert.alert('Stories', `${person}'s stories will be available when stories are connected.`)}
          >
            <View style={s.storyRing}>
              <Avatar name={person} size={53} />
            </View>
            <Text style={s.storyName}>{person}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const Home = () => (
    <>
      <View style={s.welcomeRow}>
        <View>
          <Text style={s.eyebrow}>YOUR COMMUNITY</Text>
          <Text style={s.screenTitle}>Connect with Your World</Text>
        </View>
        <Avatar name={name || 'W'} size={43} />
      </View>

      <View style={s.searchBox}>
        <Text style={s.searchIcon}>⌕</Text>
        <TextInput
          placeholder="Search WorldLink..."
          placeholderTextColor={C.muted}
          value={search}
          onChangeText={setSearch}
          style={s.searchInput}
        />
      </View>

      <View style={s.heroCard}>
        <Text style={s.heroEyebrow}>WELCOME TO WORLDLINK</Text>
        <Text style={s.heroTitle}>One world.{"\n"}Endless connections.</Text>
        <Text style={s.heroDescription}>
          Share your story and discover people who inspire you.
        </Text>
        <TouchableOpacity
          style={s.heroButton}
          onPress={() => goTab('Discover')}
        >
          <Text style={s.heroButtonText}>Explore community →</Text>
        </TouchableOpacity>
        <Text style={s.heroGlobe}>🌍</Text>
      </View>
<View style={s.buyDataCard}>
  <View style={s.buyDataInfo}>
    <Text style={s.buyDataTitle}>BUY DATA</Text>
    <Text style={s.buyDataDescription}>
      Stay connected with affordable internet bundles.
    </Text>
  </View>

  <TouchableOpacity
    style={s.buyDataButton}
    onPress={() => goTab('Buy Data')}
  >
    <Text style={s.buyDataButtonText}>Buy Now →</Text>
  </TouchableOpacity>
</View>
      <Stories />

      <View style={s.sectionRow}>
        <Label>YOUR FEED</Label>
        <Text style={s.mutedSmall}>Latest ↓</Text>
      </View>

      {posts
        .filter(p =>
          !blocked.includes(p.author) &&
          (p.text.toLowerCase().includes(search.toLowerCase()) ||
           p.author.toLowerCase().includes(search.toLowerCase()))
        )
        .map(post => <PostCard key={post.id} post={post} />)}

      {posts.length === 0 && (
        <Text style={s.muted}>No posts yet. Be the first to share!</Text>
      )}
    </>
  );

  const Discover = () => (
    <>
      <Text style={s.eyebrow}>EXPLORE WORLDLINK</Text>
      <Text style={s.screenTitle}>Discover people</Text>
      <Text style={s.muted}>Find new connections around the world.</Text>

      <View style={s.searchBox}>
        <Text style={s.searchIcon}>⌕</Text>
        <TextInput
          placeholder="Find people..."
          placeholderTextColor={C.muted}
          value={search}
          onChangeText={setSearch}
          style={s.searchInput}
        />
      </View>

      <Label>PEOPLE YOU MAY KNOW</Label>

      {people.filter(p =>
        p.toLowerCase().includes(search.toLowerCase()) &&
        !blocked.includes(p)
      ).map(person => (
        <View style={s.personCard} key={person}>
          <Avatar name={person} size={47} online />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.postAuthor}>{person}</Text>
            <Text style={s.handle}>WorldLink member</Text>
          </View>
          <TouchableOpacity
            style={[
              s.followButton,
              following.includes(person) && s.followingButton
            ]}
            onPress={() => toggleFollow(person)}
          >
            <Text style={s.followText}>
              {following.includes(person) ? 'Following' : '+ Follow'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      <Label>EXPLORE INTERESTS</Label>
      <View style={s.interestGrid}>
        {[
          ['✈', 'Travel'],
          ['💻', 'Technology'],
          ['🎵', 'Music'],
          ['⚽', 'Sports'],
          ['🎨', 'Creativity'],
          ['📚', 'Learning']
        ].map(([icon, title]) => (
          <TouchableOpacity
            key={title}
            style={s.interest}
            onPress={() => Alert.alert(title, `${title} communities are coming soon.`)}
          >
            <Text style={s.interestIcon}>{icon}</Text>
            <Text style={s.interestText}>{title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  const Create = () => (
    <>
      <Text style={s.eyebrow}>SHARE YOUR MOMENT</Text>
      <Text style={s.screenTitle}>Create something.</Text>
      <Text style={s.muted}>Your voice deserves to be heard.</Text>

      <View style={s.postCard}>
        <View style={s.postHeader}>
          <Avatar name={name || 'W'} size={46} />
          <View>
            <Text style={s.postAuthor}>{name || 'WorldLink Member'}</Text>
            <Text style={s.handle}>Sharing with your community</Text>
          </View>
        </View>

        <TextInput
          value={caption}
          onChangeText={setCaption}
          placeholder="What's happening in your world?"
          placeholderTextColor={C.muted}
          multiline
          maxLength={500}
          style={s.captionInput}
        />
        <Text style={s.characterCount}>{caption.length}/500</Text>
        <View style={s.divider} />
        <Text style={s.mutedSmall}>＋ Photo and video uploads coming soon</Text>
      </View>

      <Button title="Share with WorldLink  →" onPress={addPost} />
      <Text style={s.demoNote}>Posts are currently stored locally on this device.</Text>
    </>
  );

  const Messages = () => (
    <>
      <Text style={s.eyebrow}>STAY CONNECTED</Text>
      <Text style={s.screenTitle}>Messages</Text>
      <Text style={s.muted}>Your conversations in one place.</Text>

      <View style={s.searchBox}>
        <Text style={s.searchIcon}>⌕</Text>
        <TextInput
          placeholder="Search conversations..."
          placeholderTextColor={C.muted}
          style={s.searchInput}
        />
      </View>

      <View style={s.messageWelcome}>
        <Text style={{ fontSize: 36 }}>✉</Text>
        <Text style={s.postAuthor}>Your inbox</Text>
        <Text style={s.muted}>Real-time conversations are coming when we connect the messaging backend.</Text>
      </View>

      {people.filter(p => !blocked.includes(p)).slice(0, 3).map(person => (
        <TouchableOpacity
          key={person}
          style={s.personCard}
          onPress={() => Alert.alert('Messages', 'Real messaging will be added with the backend.')}
        >
          <Avatar name={person} size={47} online />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.postAuthor}>{person}</Text>
            <Text style={s.handle}>Start a conversation</Text>
          </View>
          <Text style={s.muted}>›</Text>
        </TouchableOpacity>
      ))}
    </>
  );

  const Profile = () => (
    <>
      <View style={s.profileCover}>
        <Text style={s.coverGlobe}>🌍</Text>
        <View style={s.profileAvatar}>
          <Avatar name={name || 'W'} size={76} />
        </View>
      </View>

      <View style={s.profileInfo}>
        <Text style={s.screenTitle}>{name || 'WorldLink Member'}</Text>
        <Text style={s.muted}>@{(name || 'member').toLowerCase().replace(/\s+/g, '')}</Text>
        <Text style={s.profileBio}>Connecting with the world. 🌍</Text>
        <Text style={s.handle}>{email}</Text>
      </View>

      <View style={s.stats}>
        <View style={s.stat}>
          <Text style={s.statNumber}>{posts.filter(p => p.author === (name || 'WorldLink Member')).length}</Text>
          <Text style={s.handle}>Posts</Text>
        </View>
        <View style={s.stat}>
          <Text style={s.statNumber}>0</Text>
          <Text style={s.handle}>Followers</Text>
        </View>
        <View style={s.stat}>
          <Text style={s.statNumber}>{following.length}</Text>
          <Text style={s.handle}>Following</Text>
        </View>
      </View>

      <TouchableOpacity
        style={s.settingsCard}
        onPress={() => Alert.alert('Edit profile', 'Profile editing will be added in the next update.')}
      >
        <Text style={s.settingIcon}>✎</Text>
        <View style={{ flex: 1 }}>
          <Text style={s.postAuthor}>Edit profile</Text>
          <Text style={s.handle}>Update your personal information</Text>
        </View>
        <Text style={s.muted}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={s.settingsCard}
        onPress={() => setPrivateAccount(!privateAccount)}
      >
        <Text style={s.settingIcon}>♧</Text>
        <View style={{ flex: 1 }}>
          <Text style={s.postAuthor}>Account privacy</Text>
          <Text style={s.handle}>{privateAccount ? 'Private' : 'Public'} account · Tap to change</Text>
        </View>
        <Text style={s.muted}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={s.settingsCard}
        onPress={() => Alert.alert('Blocked accounts', blocked.length ? blocked.join('\n') : 'No blocked accounts.')}
      >
        <Text style={s.settingIcon}>⊘</Text>
        <View style={{ flex: 1 }}>
          <Text style={s.postAuthor}>Blocked accounts</Text>
          <Text style={s.handle}>{blocked.length} accounts blocked</Text>
        </View>
        <Text style={s.muted}>›</Text>
      </TouchableOpacity>

      <Button
        title="Log out"
        secondary
        onPress={() => {
          setScreen('Welcome');
          setTab('Home');
        }}
      />
    </>
  );

  const Notifications = () => (
    <>
      <Text style={s.eyebrow}>STAY IN THE LOOP</Text>
      <Text style={s.screenTitle}>Notifications</Text>
      <Text style={s.muted}>Updates from your WorldLink community.</Text>
      <View style={s.messageWelcome}>
        <Text style={{ fontSize: 38 }}>♢</Text>
        <Text style={s.postAuthor}>You're all caught up!</Text>
        <Text style={s.muted}>New activity and notifications will appear here when connected to the backend.</Text>
      </View>
    </>
  );

  const AuthField = ({ value, onChangeText, placeholder, secure = false }) => (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={C.muted}
      secureTextEntry={secure}
      autoCapitalize="none"
      style={s.authInput}
    />
  );

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar backgroundColor={C.bg} barStyle="light-content" />
      <Header />

      {screen === 'Welcome' && (
        <ScrollView contentContainerStyle={s.welcomeScreen}>
          <View style={s.heroGlobeCircle}>
            <Text style={{ fontSize: 82 }}>🌐</Text>
          </View>
          <Text style={s.eyebrow}>THE WORLD IS YOUR COMMUNITY</Text>
          <Text style={s.welcomeTitle}>Your world.{"\n"}Your connections.</Text>
          <Text style={s.welcomeDescription}>
            Meet people, share your experiences and discover communities beyond borders.
          </Text>
          <Button title="Create your account  →" onPress={() => setScreen('Register')} />
          <Button title="Log in" secondary onPress={() => setScreen('Login')} />
          <Text style={s.demoNote}>CONNECT • SHARE • BELONG</Text>
        </ScrollView>
      )}

      {screen === 'Register' && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={s.authScreen}>
            <Text style={s.eyebrow}>JOIN THE COMMUNITY</Text>
            <Text style={s.screenTitle}>Create account</Text>
            <Text style={s.muted}>Your next connection starts here.</Text>
            <AuthField value={name} onChangeText={setName} placeholder="Full name or username" />
            <AuthField value={email} onChangeText={setEmail} placeholder="Email address" />
            <AuthField value={password} onChangeText={setPassword} placeholder="Password (6+ characters)" secure />
            <Button title="Create account  →" onPress={register} />
            <Button title="Back" secondary onPress={() => setScreen('Welcome')} />
            <Text style={s.demoNote}>Demo registration only. A secure account service is needed for real accounts.</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {screen === 'Login' && (
        <ScrollView contentContainerStyle={s.authScreen}>
          <Text style={s.eyebrow}>WELCOME BACK</Text>
          <Text style={s.screenTitle}>Log in</Text>
          <Text style={s.muted}>Continue your WorldLink journey.</Text>
          <AuthField value={email} onChangeText={setEmail} placeholder="Email address" />
          <AuthField value={password} onChangeText={setPassword} placeholder="Password" secure />
          <Button title="Log in  →" onPress={login} />
          <Button title="Back" secondary onPress={() => setScreen('Welcome')} />
          <Text style={s.demoNote}>Demo login only. Real authentication will be added later.</Text>
        </ScrollView>
      )}

      {screen === 'App' && (
        <>
          <ScrollView
            contentContainerStyle={s.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {tab === 'Home' && <Home />}
            {tab === 'Discover' && <Discover />}
            {tab === 'Create' && <Create />}
            {tab === 'Messages' && <Messages />}
            {tab === 'Profile' && <Profile />}
            {tab === 'Notifications' && <Notifications />}
          </ScrollView>
          <Nav />
        </>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  header: {
    paddingHorizontal: 19,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: C.border
  },
  brand: { flexDirection: 'row', alignItems: 'center' },
  brandIcon: {
    width: 43, height: 43, borderRadius: 14,
    backgroundColor: '#1C2D56',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 10
  },
  logo: { color: C.white, fontSize: 24, fontWeight: '900', letterSpacing: -1 },
  tagline: { color: C.muted, fontSize: 8, letterSpacing: 1.8, marginTop: 3 },
  headerAction: {
    width: 42, height: 42, borderRadius: 14,
    backgroundColor: C.surface, justifyContent: 'center',
    alignItems: 'center'
  },
  headerActionText: { color: C.white, fontSize: 24 },
  notificationDot: {
    position: 'absolute', top: 8, right: 8,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: C.pink
  },

  content: { padding: 18, paddingBottom: 35 },
  eyebrow: {
    color: C.blue, fontSize: 10, fontWeight: '900',
    letterSpacing: 2, marginBottom: 8
  },
  screenTitle: {
    color: C.white, fontSize: 26,
    fontWeight: '900', letterSpacing: -0.6,
    marginBottom: 7
  },
  muted: { color: C.muted, fontSize: 13, lineHeight: 21, marginBottom: 15 },
  mutedSmall: { color: C.muted, fontSize: 11 },

  welcomeRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 17
  },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.surface, borderRadius: 14,
    borderWidth: 1, borderColor: C.border,
    paddingHorizontal: 13, marginBottom: 20
  },
  searchIcon: { color: C.muted, fontSize: 23, marginRight: 8 },
  searchInput: { flex: 1, color: C.white, fontSize: 14, paddingVertical: 13 },

  heroCard: {
    backgroundColor: '#172D58', borderRadius: 22,
    padding: 20, marginBottom: 25,
    borderWidth: 1, borderColor: '#34518A',
    overflow: 'hidden'
  },
  heroEyebrow: { color: '#9FC6FF', fontSize: 9, letterSpacing: 2, fontWeight: '900' },
  heroTitle: {
    color: C.white, fontSize: 27, fontWeight: '900',
    lineHeight: 34, marginTop: 12
  },
  heroDescription: { color: '#C1D0F0', fontSize: 12, lineHeight: 19, marginTop: 8, width: '78%' },
  heroButton: {
    backgroundColor: C.blue, alignSelf: 'flex-start',
    paddingHorizontal: 14, paddingVertical: 11,
    borderRadius: 10, marginTop: 16
  },
  heroButtonText: { color: C.white, fontWeight: '800', fontSize: 11 },
  heroGlobe: { position: 'absolute', right: 9, bottom: 17, fontSize: 66, opacity: 0.7 },

  sectionRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12, marginTop: 7
  },
  label: {
    color: C.muted, fontSize: 10, fontWeight: '900',
    letterSpacing: 1.7, marginBottom: 13, marginTop: 13
  },
  story: { alignItems: 'center', marginRight: 17, marginBottom: 18 },
  storyAdd: { padding: 3, borderWidth: 2, borderColor: C.blue, borderRadius: 40 },
  storyRing: { padding: 3, borderWidth: 2, borderColor: C.purple, borderRadius: 40 },
  storyName: { color: C.muted, fontSize: 10, marginTop: 7 },
  plusBadge: {
    position: 'absolute', right: 0, bottom: 0,
    width: 19, height: 19, borderRadius: 10,
    backgroundColor: C.blue, justifyContent: 'center', alignItems: 'center'
  },
  plusText: { color: C.white, fontWeight: '900' },

  avatar: {
    backgroundColor: '#3B4382',
    borderWidth: 1.5, borderColor: C.purple,
    justifyContent: 'center', alignItems: 'center'
  },
  online: {
    position: 'absolute', bottom: 0, right: 0,
    width: 11, height: 11, borderRadius: 6,
    backgroundColor: C.green, borderWidth: 2, borderColor: C.card
  },

  postCard: {
    backgroundColor: C.card, borderRadius: 18,
    borderWidth: 1, borderColor: C.border,
    padding: 15, marginBottom: 15
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  postAuthor: { color: C.white, fontSize: 13, fontWeight: '800' },
  verified: { color: C.blue, fontWeight: '900', fontSize: 13 },
  handle: { color: C.muted, fontSize: 10, marginTop: 4 },
  more: { color: C.muted, fontSize: 19, padding: 5 },
  postText: { color: '#E1E8F8', fontSize: 14, lineHeight: 22, marginBottom: 16 },
  postFooter: {
    borderTopWidth: 1, borderTopColor: C.border,
    paddingTop: 13, flexDirection: 'row',
    justifyContent: 'space-between'
  },
  postAction: { color: C.muted, fontSize: 12, fontWeight: '800' },

  personCard: {
    backgroundColor: C.card, borderRadius: 15,
    borderWidth: 1, borderColor: C.border,
    padding: 12, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center'
  },
  followButton: {
    backgroundColor: C.blue, borderRadius: 9,
    paddingHorizontal: 13, paddingVertical: 9
  },
  followingButton: { backgroundColor: '#293854', borderWidth: 1, borderColor: C.blue },
  followText: { color: C.white, fontSize: 10, fontWeight: '900' },

  interestGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  interest: {
    width: '48%', backgroundColor: C.card,
    borderWidth: 1, borderColor: C.border,
    borderRadius: 14, padding: 16, marginBottom: 11
  },
  interestIcon: { fontSize: 25, marginBottom: 9 },
  interestText: { color: C.white, fontSize: 12, fontWeight: '800' },

  captionInput: {
    minHeight: 155, color: C.white, fontSize: 15,
    textAlignVertical: 'top', paddingVertical: 12
  },
  characterCount: { color: C.muted, fontSize: 10, textAlign: 'right' },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 14 },
  demoNote: { color: '#7787A8', fontSize: 10, lineHeight: 17, textAlign: 'center', marginTop: 18 },

  messageWelcome: {
    backgroundColor: C.card, borderRadius: 18,
    padding: 25, alignItems: 'center',
    borderWidth: 1, borderColor: C.border,
    marginVertical: 17
  },

  profileCover: {
    height: 125, backgroundColor: '#1D3263',
    borderRadius: 19, alignItems: 'flex-end',
    justifyContent: 'center', paddingRight: 25,
    marginBottom: 48
  },
  coverGlobe: { fontSize: 65, opacity: 0.8 },
  profileAvatar: {
    position: 'absolute', bottom: -38, left: 17,
    padding: 4, borderRadius: 50, backgroundColor: C.bg
  },
  profileInfo: { marginBottom: 18 },
  profileBio: { color: C.white, fontSize: 13, marginTop: 12 },
  stats: {
    flexDirection: 'row', backgroundColor: C.card,
    borderRadius: 16, borderWidth: 1,
    borderColor: C.border, padding: 17, marginBottom: 16
  },
  stat: { flex: 1, alignItems: 'center' },
  statNumber: { color: C.white, fontSize: 21, fontWeight: '900', marginBottom: 4 },
  settingsCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.card, borderWidth: 1,
    borderColor: C.border, borderRadius: 14,
    padding: 15, marginBottom: 10
  },
  settingIcon: { color: C.purple, fontSize: 22, marginRight: 13 },

  button: {
    width: '100%', backgroundColor: C.blue,
    borderRadius: 13, padding: 16,
    alignItems: 'center', marginTop: 12
  },
  secondary: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  buttonText: { color: C.white, fontWeight: '900', fontSize: 14 },

  nav: {
    flexDirection: 'row', backgroundColor: '#0D152B',
    borderTopWidth: 1, borderTopColor: C.border,
    paddingTop: 8, paddingBottom: Platform.OS === 'ios' ? 17 : 8
  },
  navItem: { flex: 1, alignItems: 'center' },
  navIconWrap: {
    width: 43, height: 32, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center'
  },
  navActive: { backgroundColor: '#293D70' },
  navIcon: { color: C.muted, fontSize: 22 },
  navText: { color: C.muted, fontSize: 9, marginTop: 4, fontWeight: '700' },

  welcomeScreen: {
    flexGrow: 1, justifyContent: 'center',
    alignItems: 'center', padding: 25
  },
  heroGlobeCircle: {
    width: 150, height: 150, borderRadius: 80,
    backgroundColor: '#172D58', borderWidth: 2,
    borderColor: C.purple, alignItems: 'center',
    justifyContent: 'center', marginBottom: 30
  },
  welcomeTitle: {
    color: C.white, fontSize: 35,
    fontWeight: '900', textAlign: 'center',
    lineHeight: 43, marginBottom: 14
  },
  welcomeDescription: {
    color: C.muted, fontSize: 14,
    lineHeight: 23, textAlign: 'center',
    marginBottom: 20
  },
  authScreen: { flexGrow: 1, padding: 22, justifyContent: 'center' },
  authInput: {
    backgroundColor: C.surface, color: C.white,
    borderWidth: 1, borderColor: C.border,
    borderRadius: 13, padding: 15,
    fontSize: 14, marginTop: 13
  }
});
buyDataCard: {
  backgroundColor: '#151F3A',
  borderRadius: 18,
  padding: 18,
  marginVertical: 15,
  borderWidth: 1,
  borderColor: '#287BFF',
},
buyDataInfo: {
  marginBottom: 15,
},
buyDataTitle: {
  color: '#FFFFFF',
  fontSize: 18,
  fontWeight: 'bold',
},
buyDataDescription: {
  color: '#AAB7D0',
  fontSize: 13,
  marginTop: 6,
},
buyDataButton: {
  backgroundColor: '#287BFF',
  padding: 13,
  borderRadius: 12,
  alignItems: 'center',
},
buyDataButtonText: {
  color: '#FFFFFF',
  fontWeight: 'bold',
  fontSize: 15,
},
