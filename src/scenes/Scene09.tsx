import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Building2, Package, ShoppingCart, Star, Truck} from 'lucide-react';
import {SceneBackground} from '../components/SceneBackground';
import {Eyebrow} from '../components/Eyebrow';
import {AnimatedText} from '../components/AnimatedText';
import {Pill} from '../components/Pill';
import {colors, radius, shadows} from '../theme';
import {fontBody, fontDisplay} from '../fonts';

/**
 * Cena 9 (2:25–2:42) — Compra integrada: ingrediente "sai" da
 * receita e voa para o carrinho; card de fornecedor/preço aparece.
 */

const FLY_START = 110;
const FLY_END = 160;
const SUPPLIER_IN = 200;

const RECIPE_POS = {x: 380, y: 540};
const CART_POS = {x: 1480, y: 470};

const INGREDIENTS = [
  {name: 'Leite integral', qty: '520 g', inStock: true},
  {name: 'Pistache puro', qty: '80 g', inStock: false},
  {name: 'Sacarose', qty: '190 g', inStock: true},
  {name: 'Neutro base branca', qty: '5 g', inStock: true},
];

export const Scene09: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const recipeIn = spring({frame: frame - 10, fps, config: {damping: 200, stiffness: 90}});
  const cartIn = spring({frame: frame - 40, fps, config: {damping: 13, stiffness: 120, mass: 0.8}});

  // Voo do chip: arco parabólico da receita até o carrinho
  const flight = interpolate(frame, [FLY_START, FLY_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const eased = 1 - Math.pow(1 - flight, 2.4);
  const chipX = RECIPE_POS.x + 120 + (CART_POS.x - RECIPE_POS.x - 160) * eased;
  const chipY =
    RECIPE_POS.y - 90 +
    (CART_POS.y - RECIPE_POS.y + 40) * eased -
    Math.sin(eased * Math.PI) * 220;
  const chipVisible = frame >= FLY_START && frame <= FLY_END + 4;

  // Carrinho "pula" quando o chip chega
  const cartBounce = spring({
    frame: frame - FLY_END,
    fps,
    config: {damping: 8, stiffness: 200, mass: 0.6},
  });
  const cartScale =
    frame >= FLY_END ? 1 + Math.sin(cartBounce * Math.PI) * 0.12 : 1;

  const badgePop = spring({
    frame: frame - FLY_END - 4,
    fps,
    config: {damping: 9, stiffness: 240, mass: 0.5},
  });

  const supplierIn = spring({
    frame: frame - SUPPLIER_IN,
    fps,
    config: {damping: 200, stiffness: 95},
  });

  return (
    <SceneBackground>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 56, gap: 12}}>
        <Eyebrow delay={2}>Fornecedores e compras</Eyebrow>
        <AnimatedText
          text="Adquira os ingredientes da receita diretamente pela plataforma"
          delay={12}
          stagger={2}
          style={{
            fontFamily: fontBody,
            fontWeight: 500,
            fontSize: 30,
            color: colors.textMuted,
          }}
        />
      </AbsoluteFill>

      {/* Card da receita */}
      <div
        style={{
          position: 'absolute',
          left: RECIPE_POS.x - 240,
          top: RECIPE_POS.y - 200,
          width: 520,
          opacity: recipeIn,
          transform: `translateY(${(1 - recipeIn) * 50}px)`,
          borderRadius: radius.shell,
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.shell,
          padding: 32,
        }}
      >
        <span
          style={{
            fontFamily: fontBody,
            fontWeight: 700,
            fontSize: 28,
            color: colors.textPrimary,
          }}
        >
          Gelato de Pistache
        </span>
        <div style={{marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10}}>
          {INGREDIENTS.map((ing, i) => {
            const rowIn = interpolate(frame - 30 - i * 8, [0, 10], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const isMissing = !ing.inStock;
            // O item "faltante" some do card durante o voo
            const flyOut = isMissing
              ? interpolate(frame, [FLY_START - 8, FLY_START + 4], [1, 0.35], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                })
              : 1;
            return (
              <div
                key={ing.name}
                style={{
                  opacity: rowIn * flyOut,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '13px 18px',
                  borderRadius: radius.md,
                  backgroundColor: isMissing ? colors.dangerSoft : colors.surfaceMuted,
                  border: `1px solid ${isMissing ? colors.danger : colors.borderSoft}`,
                  fontFamily: fontBody,
                  fontSize: 21,
                }}
              >
                <span style={{fontWeight: 600, color: colors.textPrimary}}>{ing.name}</span>
                <span style={{color: isMissing ? colors.danger : colors.textMuted, fontWeight: 600}}>
                  {isMissing ? 'em falta' : ing.qty}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chip voador */}
      {chipVisible ? (
        <div
          style={{
            position: 'absolute',
            left: chipX,
            top: chipY,
            transform: `translate(-50%, -50%) rotate(${eased * 14}deg)`,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            backgroundColor: colors.surface,
            border: `2px solid ${colors.primary}`,
            borderRadius: 26,
            boxShadow: shadows.shell,
            padding: '12px 24px',
            fontFamily: fontBody,
            fontWeight: 700,
            fontSize: 23,
            color: colors.textPrimary,
            zIndex: 10,
          }}
        >
          <Package size={24} color={colors.primary} />
          Pistache puro · 1 kg
        </div>
      ) : null}

      {/* Carrinho */}
      <div
        style={{
          position: 'absolute',
          left: CART_POS.x - 110,
          top: CART_POS.y - 110,
          opacity: cartIn,
          transform: `scale(${cartIn * cartScale})`,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 220,
            height: 220,
            borderRadius: '50%',
            backgroundColor: colors.primarySoft,
            border: `2px solid ${colors.border}`,
            boxShadow: shadows.shell,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ShoppingCart size={96} color={colors.primary} strokeWidth={1.7} />
          <div
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              transform: `scale(${badgePop})`,
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: colors.danger,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: fontBody,
              fontWeight: 700,
              fontSize: 28,
              color: colors.textInverse,
              boxShadow: shadows.md,
            }}
          >
            1
          </div>
        </div>
      </div>

      {/* Card do fornecedor */}
      <div
        style={{
          position: 'absolute',
          left: CART_POS.x - 260,
          top: CART_POS.y + 150,
          width: 520,
          opacity: supplierIn,
          transform: `translateY(${(1 - supplierIn) * 44}px)`,
          borderRadius: radius.lg,
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.shell,
          padding: 28,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: radius.md,
              backgroundColor: colors.primarySoft,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Building2 size={32} color={colors.primary} strokeWidth={1.9} />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
            <span
              style={{
                fontFamily: fontBody,
                fontWeight: 700,
                fontSize: 25,
                color: colors.textPrimary,
              }}
            >
              Distribuidora Gelato Sul
            </span>
            <div style={{display: 'flex', gap: 10}}>
              <Pill bg={colors.warningSoft} color="#92400E" fontSize={16}>
                <Star size={16} color="#92400E" fill="#F59E0B" />
                Fornecedor principal
              </Pill>
              <Pill bg={colors.successSoft} color={colors.success} fontSize={16}>
                <Truck size={16} color={colors.success} />
                Entrega em 2 dias
              </Pill>
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `1px solid ${colors.borderSoft}`,
            paddingTop: 16,
          }}
        >
          <span
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: 38,
              color: colors.textPrimary,
              whiteSpace: 'nowrap',
            }}
          >
            R$ 189,90
          </span>
          <div
            style={{
              backgroundColor: colors.primary,
              color: colors.textInverse,
              fontFamily: fontBody,
              fontWeight: 600,
              fontSize: 20,
              padding: '14px 24px',
              borderRadius: radius.md,
              boxShadow: shadows.md,
              whiteSpace: 'nowrap',
            }}
          >
            Comprar pela plataforma
          </div>
        </div>
      </div>
    </SceneBackground>
  );
};
