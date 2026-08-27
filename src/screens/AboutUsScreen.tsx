import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { ActivityIndicator } from 'react-native';
import { Icon } from '@rneui/themed';
import BackButton from '../components/BackButton';
import { colors, radii } from '../theme';

export default function AboutUsScreen() {
    const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
            <BackButton />
            <ScrollView style={styles.scrollView}>
                <View style={styles.header}>
                    <Icon name="info-circle" type="font-awesome-5" color={colors.accent} size={36} />
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
                        <ActivityIndicator size="large" color={colors.accent} style={styles.loadingIndicator} />
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
                        <Icon name="user" type="font-awesome-5" color={colors.accent} size={14} />
                        <Text style={styles.teamMemberName}>Arthur Moreira</Text>
                    </View>
                    <View style={styles.teamMember}>
                        <Icon name="user" type="font-awesome-5" color={colors.accent} size={14} />
                        <Text style={styles.teamMemberName}>Daniel Formoso</Text>
                    </View>
                    <View style={styles.teamMember}>
                        <Icon name="user" type="font-awesome-5" color={colors.accent} size={14} />
                        <Text style={styles.teamMemberName}>Guilherme Valentim</Text>
                    </View>
                    <View style={styles.teamMember}>
                        <Icon name="user" type="font-awesome-5" color={colors.accent} size={14} />
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
        backgroundColor: colors.bg,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        padding: 20,
        paddingTop: 72,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: colors.text,
        marginTop: 14,
        letterSpacing: -0.4,
    },
    section: {
        marginHorizontal: 20,
        marginBottom: 16,
        padding: 18,
        backgroundColor: colors.surface,
        borderRadius: radii.lg,
        borderWidth: 1,
        borderColor: colors.border,
        position: 'relative',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 10,
    },
    text: {
        fontSize: 15,
        color: colors.muted,
        lineHeight: 23,
    },
    teamMember: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    teamMemberName: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.text,
        marginLeft: 12,
    },
    video: {
        width: '100%',
        height: 200,
        marginTop: 16,
        borderRadius: radii.md,
        overflow: 'hidden',
        backgroundColor: colors.surfaceAlt,
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