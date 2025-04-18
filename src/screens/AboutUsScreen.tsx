import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { ActivityIndicator } from 'react-native';
import { Icon } from '@rneui/themed';
import BackButton from '../components/BackButton';

export default function AboutUsScreen() {
    const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
            <BackButton />
            <ScrollView style={styles.scrollView}>
                <View style={styles.header}>
                    <Icon name="info-circle" type="font-awesome-5" color="#414692" size={50} />
                    <Text style={styles.title}>Sobre Nós</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sobre o Aplicativo</Text>
                    <Text style={styles.text}>
                        O iTBI-calc é um aplicativo criado para simplificar o cálculo e a gestão do Imposto sobre Transmissão de Bens Imóveis (ITBI).
                        Com uma interface intuitiva e funcionalidades inteligentes, ele oferece uma solução prática tanto para proprietários quanto para profissionais do mercado imobiliário, tornando a administração de imóveis e tributos muito mais eficiente.
                    </Text>

                    <Video
                        source={require('../../assets/videoApresentacao.mp4')}
                        style={styles.video}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        isLooping
                        onLoadStart={() => setVideoLoaded(false)}
                        onLoad={() => setVideoLoaded(true)}
                        isMuted={false}
                    />

                    {!videoLoaded && (
                        <ActivityIndicator size="large" color="#8F94FB" style={styles.loadingIndicator} />
                    )}


                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Nossa Missão</Text>
                    <Text style={styles.text}>
                        Nossa missão é simplificar o cálculo e a gestão do ITBI, tornando esse processo mais acessível, transparente e prático para todos os usuários.
                        Estamos sempre em busca de aprimorar a experiência dentro do app, adicionando novas funcionalidades que realmente façam a diferença no seu dia a dia.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Desenvolvedores</Text>
                    <View style={styles.teamMember}>
                        <Icon name="user" type="font-awesome-5" color="#414692" size={24} />
                        <Text style={styles.teamMemberName}>Equipe de Desenvolvimento</Text>
                    </View>
                    <Text style={styles.text}>
                    Somos um grupo de alunos dedicados, interessados em tecnologia e focados em criar soluções que proporcionem uma boa experiência para os nossos usuários.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contato</Text>
                    <Text style={styles.text}>
                        Para sugestões, dúvidas ou feedback, entre em contato conosco através do email:
                        suporte@itbicalc.com.br
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A2E',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        padding: 20,
        paddingTop: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 16,
    },
    section: {
        padding: 20,
        marginBottom: 20,
        position: 'relative',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#8F94FB',
        marginBottom: 12,
    },
    text: {
        fontSize: 17,
        color: '#FFF',
        lineHeight: 24,
    },
    teamMember: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    teamMemberName: {
        fontSize: 19,
        fontWeight: '600',
        color: '#FFF',
        marginLeft: 12,
    },

    video: {
        width: '100%',
        height: 200,
        marginTop: 20,
        borderRadius: 8,
    },

    loadingIndicator: {
        position: 'absolute', 
        top: 0,  
        left: 0, 
        right: 0,
        bottom: 0, 
        marginTop: 250,
        justifyContent: 'center', 
        alignItems: 'center', 
    },
}); 