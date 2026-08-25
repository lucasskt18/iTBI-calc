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
                    <Text style={styles.title}>Sobre o Projeto</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sobre o Aplicativo</Text>
                    <Text style={styles.text}>
                        O iTBI-calc é um aplicativo desenvolvido para facilitar o cálculo e a gestão do Imposto sobre Transmissão de Bens Imóveis (ITBI). Com uma interface amigável e recursos inteligentes, o app oferece uma solução prática e eficiente tanto para proprietários quanto para profissionais do setor imobiliário, otimizando o processo de administração de imóveis e tributos.
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
                    <Text style={styles.sectionTitle}>Equipe de Desenvolvimento</Text>
                    <View style={styles.teamMember}>
                        <Icon name="user" type="font-awesome-5" color="#414692" size={17} />
                        <Text style={styles.teamMemberName}>Arthur Moreira</Text>
                    </View>
                    <View style={styles.teamMember}>
                        <Icon name="user" type="font-awesome-5" color="#414692" size={17} />
                        <Text style={styles.teamMemberName}>Daniel Formoso</Text>
                    </View>
                    <View style={styles.teamMember}>
                        <Icon name="user" type="font-awesome-5" color="#414692" size={17} />
                        <Text style={styles.teamMemberName}>Guilherme Pereira</Text>
                    </View>
                    <View style={styles.teamMember}>
                        <Icon name="user" type="font-awesome-5" color="#414692" size={17} />
                        <Text style={styles.teamMemberName}>Lucas Amancio</Text>
                    </View>
                    <Text style={styles.text}>
                    Somos um grupo de estudantes dedicados e apaixonados por tecnologia, com o objetivo de desenvolver soluções inovadoras que ofereçam uma experiência positiva, prática e eficiente para nossos usuários.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contato</Text>
                    <Text style={styles.text}>
                    Para mais informações sobre este projeto, entre em contato com a equipe de desenvolvimento através da instituição de ensino.
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
        paddingTop: 60,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 16,
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 10,
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
        fontSize: 17,
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